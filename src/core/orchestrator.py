from __future__ import annotations

from src.agents import director_claw, edit_claw, idea_claw, strategy_claw, taste_claw
from src.config import Config
from src.core.cost_tracker import CostTracker
from src.core.llm_client import LLMClient
from src.core.types import Brief, CampaignOutput, ShotAssets
from src.memory.vault import VaultClient
from src.production.composite import compose_prompt
from src.production.elevenlabs_adapter import ElevenLabsClient
from src.production.meshy_adapter import MeshyClient
from src.production.video_client import VideoClient
from src.production.worldlabs_adapter import WorldLabsClient
from src.trust.decision_log import DecisionLog


async def run_campaign(brief: Brief, config: Config) -> CampaignOutput:
    llm = LLMClient(config.llm_backend, config)
    video = VideoClient(config.video_backend, config)
    meshy = MeshyClient(config)
    worldlabs = WorldLabsClient(config)
    elevenlabs = ElevenLabsClient(config)
    vault = VaultClient()
    log = DecisionLog()
    costs = CostTracker()

    insight = await strategy_claw.run(brief, llm)
    log.record("strategy", insight.model_dump())

    refs: list[str] = []
    if vault.available():
        refs = await vault.search(insight.positioning, top_k=5)
    concepts = await idea_claw.run(insight, refs, llm)
    log.record("ideation", [c.model_dump() for c in concepts])

    taste_llm = LLMClient("nvidia", config) if config.nvidia_api_key else llm
    scored = await taste_claw.run(concepts, taste_llm)
    log.record("scoring", scored.model_dump())

    if scored.verdict == "kill":
        concepts = await idea_claw.run(insight, refs, llm, feedback=scored.feedback, attempt=2)
        scored = await taste_claw.run(concepts, taste_llm)
        log.record("scoring_retry", scored.model_dump())

    if scored.verdict == "kill":
        return CampaignOutput(status="killed", decision_log=log.export(), cost_report=costs.report())

    shot_plan = await director_claw.run(scored.winner.concept, llm, duration_seconds=brief.duration_seconds)
    log.record("direction", shot_plan.model_dump())

    assets: dict[int, ShotAssets] = {}
    for shot in shot_plan.shots:
        shot_models: dict[str, str] = {}
        for char_desc in shot.characters:
            task_id = await meshy.text_to_3d(char_desc)
            result = await meshy.poll(task_id, "text-to-3d")
            glb_path = await meshy.download(result, f"outputs/models/shot{shot.shot_number}")
            shot_models[char_desc] = glb_path
            costs.record("meshy", "meshy-6", 30, 0.0)

        env_op_id = await worldlabs.generate_from_text(
            prompt=shot.environment,
            name=f"Shot {shot.shot_number} environment",
        )
        env_result = await worldlabs.poll(env_op_id)
        env_url = env_result.get("browser_url", "")
        env_splat = env_result.get("outputs", {}).get("splat_100k", "")

        composite_prompt = compose_prompt(
            scene_description=shot.scene_description,
            characters=shot.characters,
            environment=shot.environment,
            camera=shot.camera,
            animation_prompt=shot.animation_prompt,
        )

        video_url = await video.generate(
            prompt=composite_prompt,
            image_url=env_url if env_url else None,
            duration=int(shot.duration_seconds),
            aspect="16:9",
        )
        costs.record("video", config.video_backend, int(shot.duration_seconds), 0.0)

        audio_path = None
        if shot.audio and shot.audio.strip():
            if shot.audio.startswith("VO:"):
                audio_path = await elevenlabs.tts(shot.audio.removeprefix("VO:").strip())
            else:
                audio_path = await elevenlabs.sfx(shot.audio, duration=int(shot.duration_seconds))
            costs.record("elevenlabs", "tts-or-sfx", int(shot.duration_seconds), 0.0)

        assets[shot.shot_number] = ShotAssets(
            models=shot_models,
            environment_url=env_url,
            environment_splat=env_splat,
            video_url=video_url,
            audio_path=audio_path,
        )

    edit_list = await edit_claw.run(shot_plan, {k: v.model_dump() for k, v in assets.items()}, llm)
    log.record("edit", edit_list.model_dump())

    status = "review" if scored.verdict == "review" else "shipped"
    return CampaignOutput(
        status=status,
        brief=brief,
        insight=insight,
        concepts=concepts,
        scored=scored,
        shot_plan=shot_plan,
        assets=assets,
        edit_list=edit_list,
        decision_log=log.export(),
        cost_report=costs.report(),
    )
