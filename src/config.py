from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass
class Config:
    llm_backend: str = "claude"
    video_backend: str = "runway"
    debug: bool = False

    nvidia_api_key: str = ""
    nvidia_nim_base_url: str = "https://integrate.api.nvidia.com/v1"
    nvidia_llm_model: str = "nvidia/llama-3.1-nemotron-70b-instruct"

    anthropic_api_key: str = ""
    claude_model: str = "claude-sonnet-4-20250514"

    runway_api_key: str = ""
    runway_api_secret: str = ""
    luma_api_key: str = ""

    meshy_api_key: str = ""
    worldlabs_api_key: str = ""
    elevenlabs_api_key: str = ""


def load_config() -> Config:
    return Config(
        nvidia_api_key=os.getenv("NVIDIA_API_KEY", ""),
        nvidia_nim_base_url=os.getenv("NVIDIA_NIM_BASE_URL", "https://integrate.api.nvidia.com/v1"),
        nvidia_llm_model=os.getenv("NVIDIA_LLM_MODEL", "nvidia/llama-3.1-nemotron-70b-instruct"),
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY", ""),
        claude_model=os.getenv("CLAUDE_MODEL", "claude-sonnet-4-20250514"),
        runway_api_key=os.getenv("RUNWAY_API_KEY", ""),
        runway_api_secret=os.getenv("RUNWAY_API_SECRET", ""),
        luma_api_key=os.getenv("LUMA_API_KEY", ""),
        meshy_api_key=os.getenv("MESHY_API_KEY", ""),
        worldlabs_api_key=os.getenv("WORLDLABS_API_KEY", ""),
        elevenlabs_api_key=os.getenv("ELEVENLABS_API_KEY", ""),
    )
