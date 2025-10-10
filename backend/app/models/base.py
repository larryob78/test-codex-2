from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class TimestampedModel(BaseModel):
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)

    def touch(self) -> None:
        object.__setattr__(self, "updated_at", utc_now())


class PromptTemplate(BaseModel):
    base: str
    user_customization: str = ""


class DefaultPrompts(BaseModel):
    black_and_white: PromptTemplate = Field(
        default_factory=lambda: PromptTemplate(
            base="Black and white sketch style, storyboard frame, hand-drawn aesthetic",
        )
    )
    color: PromptTemplate = Field(
        default_factory=lambda: PromptTemplate(
            base="Full color, cinematic lighting, professional illustration",
        )
    )


class Project(TimestampedModel):
    id: UUID = Field(default_factory=uuid4)
    name: str
    description: Optional[str] = None
    default_prompts: DefaultPrompts = Field(default_factory=DefaultPrompts)
    frames: List[UUID] = Field(default_factory=list)
    characters: List[UUID] = Field(default_factory=list)
    locations: List[UUID] = Field(default_factory=list)
    props: List[UUID] = Field(default_factory=list)


class Sketch(BaseModel):
    image_url: Optional[str] = None
    file_name: Optional[str] = None
    uploaded_at: Optional[datetime] = None


class FrameMetadata(BaseModel):
    scene: Optional[str] = None
    take: Optional[int] = None
    notes: Optional[str] = None


class Frame(TimestampedModel):
    id: UUID = Field(default_factory=uuid4)
    project_id: UUID
    frame_number: int
    prompt: str = ""
    sketch: Sketch = Field(default_factory=Sketch)
    metadata: FrameMetadata = Field(default_factory=FrameMetadata)
    selected_characters: List[UUID] = Field(default_factory=list)
    selected_locations: List[UUID] = Field(default_factory=list)
    selected_props: List[UUID] = Field(default_factory=list)
    confirmed_image_url: Optional[str] = None
    confirmed_type: Optional[str] = None
    confirmed_generation_id: Optional[UUID] = None


class GenerationSettings(BaseModel):
    mode: str = "turbo"
    iterations: int = 4
    style_strength: int = 75
    prompt_weight: int = 75
    aspect_ratio: str = "16:9"
    seed: Optional[int] = None


class Generation(TimestampedModel):
    id: UUID = Field(default_factory=uuid4)
    frame_id: UUID
    image_url: str
    thumbnail_url: Optional[str] = None
    type: str
    prompt: str
    settings: GenerationSettings
    is_confirmed: bool = False




class ProjectDetail(Project):
    frames: List[Frame] = Field(default_factory=list)
    characters: List["Character"] = Field(default_factory=list)
    locations: List["Location"] = Field(default_factory=list)
    props: List["Prop"] = Field(default_factory=list)


class ExportJob(TimestampedModel):
    id: UUID = Field(default_factory=uuid4)
    project_id: UUID
    status: str = "pending"
    format: str = "pdf"
    download_url: Optional[str] = None


class Character(TimestampedModel):
    id: UUID = Field(default_factory=uuid4)
    project_id: UUID
    name: str
    description: Optional[str] = None
    consistency_prompt: Optional[str] = None
    reference_images: List[str] = Field(default_factory=list)


class Location(TimestampedModel):
    id: UUID = Field(default_factory=uuid4)
    project_id: UUID
    name: str
    description: Optional[str] = None
    type: Optional[str] = None
    consistency_prompt: Optional[str] = None
    reference_images: List[str] = Field(default_factory=list)


class Prop(TimestampedModel):
    id: UUID = Field(default_factory=uuid4)
    project_id: UUID
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    consistency_prompt: Optional[str] = None
    reference_image: Optional[str] = None


class VideoProvider(BaseModel):
    id: str
    name: str
    description: str
    supported_capabilities: List[str]
    max_duration_seconds: int


class VideoGenerationRequest(BaseModel):
    provider_id: str
    prompt: str
    storyboard_frame_ids: List[UUID] = Field(default_factory=list)
    aspect_ratio: str = "16:9"


class VideoGenerationJob(TimestampedModel):
    id: UUID = Field(default_factory=uuid4)
    project_id: UUID
    provider_id: str
    prompt: str
    aspect_ratio: str
    status: str = "queued"
    preview_url: Optional[str] = None


ProjectDetail.update_forward_refs(Character=Character, Location=Location, Prop=Prop)
