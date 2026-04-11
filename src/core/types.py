from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class Brief(BaseModel):
    brand: str
    product: str = ""
    objective: str
    audience: str
    tone: str
    constraints: list[str] = Field(default_factory=list)
    duration_seconds: int = 30


class Insight(BaseModel):
    strategic_tension: str
    human_truth: str
    brand_opportunity: str
    positioning: str


class Concept(BaseModel):
    route: Literal["safe", "bold", "unexpected"]
    concept_name: str
    tagline: str
    visual_world: str
    key_scenes: list[str]
    tone: str
    why_it_works: str


class DimensionScore(BaseModel):
    dimension: str
    score: int
    rationale: str


class ConceptScore(BaseModel):
    concept: Concept
    dimensions: list[DimensionScore]
    total_score: int
    what_elevates: str
    what_holds_back: str


class ScoredConcepts(BaseModel):
    scores: list[ConceptScore]
    winner: ConceptScore
    verdict: Literal["kill", "review", "ship"]
    feedback: str


class Shot(BaseModel):
    shot_number: int
    duration_seconds: float
    camera: str
    scene_description: str
    characters: list[str]
    environment: str
    animation_prompt: str
    audio: str
    emotion: str


class ShotPlan(BaseModel):
    concept_name: str
    total_duration_seconds: int
    overall_pacing: Literal["fast", "medium", "slow"]
    music_direction: str
    shots: list[Shot]


class ShotAssets(BaseModel):
    models: dict[str, str]
    environment_url: str
    environment_splat: str
    video_url: str
    audio_path: str | None = None


class CostEntry(BaseModel):
    agent: str
    model: str
    tokens_or_credits: int
    cost_usd: float
    timestamp: str


class EditDecisionList(BaseModel):
    sequencing_notes: str
    transitions: list[str]


class CampaignOutput(BaseModel):
    status: Literal["shipped", "review", "killed"] = "shipped"
    brief: Brief | None = None
    insight: Insight | None = None
    concepts: list[Concept] | None = None
    scored: ScoredConcepts | None = None
    shot_plan: ShotPlan | None = None
    assets: dict[int, ShotAssets] | None = None
    edit_list: EditDecisionList | None = None
    decision_log: list[dict] = Field(default_factory=list)
    cost_report: list[CostEntry] = Field(default_factory=list)
