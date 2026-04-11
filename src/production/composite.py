from __future__ import annotations


def compose_prompt(scene_description: str, characters: list[str], environment: str, camera: str, animation_prompt: str) -> str:
    return (
        f"Scene: {scene_description}. "
        f"Characters: {', '.join(characters)}. "
        f"Environment: {environment}. "
        f"Camera: {camera}. "
        f"Animation: {animation_prompt}."
    )
