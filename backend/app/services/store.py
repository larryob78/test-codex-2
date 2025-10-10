from __future__ import annotations

from typing import Dict, List
from uuid import UUID

from ..models.base import (
    Character,
    ExportJob,
    Frame,
    Generation,
    Location,
    Project,
    Prop,
    VideoGenerationJob,
)


class InMemoryStore:
    def __init__(self) -> None:
        self.projects: Dict[UUID, Project] = {}
        self.frames: Dict[UUID, Frame] = {}
        self.generations: Dict[UUID, Generation] = {}
        self.exports: Dict[UUID, ExportJob] = {}
        self.characters: Dict[UUID, Character] = {}
        self.locations: Dict[UUID, Location] = {}
        self.props: Dict[UUID, Prop] = {}
        self.video_jobs: Dict[UUID, VideoGenerationJob] = {}

    def reset(self) -> None:
        self.projects.clear()
        self.frames.clear()
        self.generations.clear()
        self.exports.clear()
        self.characters.clear()
        self.locations.clear()
        self.props.clear()
        self.video_jobs.clear()

    # Project operations
    def create_project(self, project: Project) -> Project:
        self.projects[project.id] = project
        return project

    def list_projects(self) -> List[Project]:
        return list(self.projects.values())

    def get_project(self, project_id: UUID) -> Project:
        return self.projects[project_id]

    def update_project(self, project_id: UUID, project: Project) -> Project:
        project.touch()
        self.projects[project_id] = project
        return project

    def delete_project(self, project_id: UUID) -> None:
        project = self.projects.pop(project_id, None)
        if not project:
            return
        for frame_id in project.frames:
            self.frames.pop(frame_id, None)
        for character_id in project.characters:
            self.characters.pop(character_id, None)
        for location_id in project.locations:
            self.locations.pop(location_id, None)
        for prop_id in project.props:
            self.props.pop(prop_id, None)
        for job_id, job in list(self.video_jobs.items()):
            if job.project_id == project_id:
                self.video_jobs.pop(job_id)

    # Frame operations
    def create_frame(self, frame: Frame) -> Frame:
        self.frames[frame.id] = frame
        project = self.projects[frame.project_id]
        project.frames.append(frame.id)
        project.touch()
        return frame

    def list_frames(self, project_id: UUID) -> List[Frame]:
        project = self.projects[project_id]
        return [self.frames[f_id] for f_id in project.frames]

    def get_frame(self, frame_id: UUID) -> Frame:
        return self.frames[frame_id]

    def update_frame(self, frame_id: UUID, frame: Frame) -> Frame:
        frame.touch()
        self.frames[frame_id] = frame
        return frame

    def delete_frame(self, frame_id: UUID) -> None:
        frame = self.frames.pop(frame_id, None)
        if not frame:
            return
        project = self.projects[frame.project_id]
        if frame_id in project.frames:
            project.frames.remove(frame_id)
            project.touch()
        for gen_id, generation in list(self.generations.items()):
            if generation.frame_id == frame_id:
                self.generations.pop(gen_id)

    # Character operations
    def create_character(self, character: Character) -> Character:
        self.characters[character.id] = character
        project = self.projects[character.project_id]
        project.characters.append(character.id)
        project.touch()
        return character

    def list_characters(self, project_id: UUID) -> List[Character]:
        return [self.characters[c_id] for c_id in self.projects[project_id].characters]

    def get_character(self, character_id: UUID) -> Character:
        return self.characters[character_id]

    def update_character(self, character_id: UUID, character: Character) -> Character:
        character.touch()
        self.characters[character_id] = character
        return character

    def delete_character(self, character_id: UUID) -> None:
        character = self.characters.pop(character_id, None)
        if not character:
            return
        project = self.projects[character.project_id]
        if character_id in project.characters:
            project.characters.remove(character_id)

    # Location operations
    def create_location(self, location: Location) -> Location:
        self.locations[location.id] = location
        project = self.projects[location.project_id]
        project.locations.append(location.id)
        project.touch()
        return location

    def list_locations(self, project_id: UUID) -> List[Location]:
        return [self.locations[l_id] for l_id in self.projects[project_id].locations]

    def get_location(self, location_id: UUID) -> Location:
        return self.locations[location_id]

    def update_location(self, location_id: UUID, location: Location) -> Location:
        location.touch()
        self.locations[location_id] = location
        return location

    def delete_location(self, location_id: UUID) -> None:
        location = self.locations.pop(location_id, None)
        if not location:
            return
        project = self.projects[location.project_id]
        if location_id in project.locations:
            project.locations.remove(location_id)

    # Prop operations
    def create_prop(self, prop: Prop) -> Prop:
        self.props[prop.id] = prop
        project = self.projects[prop.project_id]
        project.props.append(prop.id)
        project.touch()
        return prop

    def list_props(self, project_id: UUID) -> List[Prop]:
        return [self.props[p_id] for p_id in self.projects[project_id].props]

    def get_prop(self, prop_id: UUID) -> Prop:
        return self.props[prop_id]

    def update_prop(self, prop_id: UUID, prop: Prop) -> Prop:
        prop.touch()
        self.props[prop_id] = prop
        return prop

    def delete_prop(self, prop_id: UUID) -> None:
        prop = self.props.pop(prop_id, None)
        if not prop:
            return
        project = self.projects[prop.project_id]
        if prop_id in project.props:
            project.props.remove(prop_id)

    # Generation operations
    def create_generation(self, generation: Generation) -> Generation:
        self.generations[generation.id] = generation
        frame = self.frames[generation.frame_id]
        frame.touch()
        self.frames[generation.frame_id] = frame
        return generation

    def list_generations_for_frame(self, frame_id: UUID) -> List[Generation]:
        generations = [g for g in self.generations.values() if g.frame_id == frame_id]
        return sorted(generations, key=lambda item: item.created_at)

    def confirm_generation(self, generation_id: UUID) -> Generation:
        generation = self.generations[generation_id]
        frame = self.frames[generation.frame_id]

        for existing in self.generations.values():
            if existing.frame_id == frame.id and existing.is_confirmed and existing.id != generation_id:
                existing.is_confirmed = False

        generation.is_confirmed = True
        self.generations[generation_id] = generation

        frame.confirmed_image_url = generation.image_url
        frame.confirmed_type = generation.type
        frame.confirmed_generation_id = generation.id
        frame.touch()
        self.frames[frame.id] = frame
        project = self.projects[frame.project_id]
        project.touch()
        self.projects[project.id] = project
        return generation

    # Export operations
    def create_export(self, export: ExportJob) -> ExportJob:
        self.exports[export.id] = export
        return export

    def get_export(self, export_id: UUID) -> ExportJob:
        return self.exports[export_id]

    # Video operations
    def create_video_job(self, job: VideoGenerationJob) -> VideoGenerationJob:
        self.video_jobs[job.id] = job
        return job

    def list_video_jobs(self, project_id: UUID) -> List[VideoGenerationJob]:
        return [job for job in self.video_jobs.values() if job.project_id == project_id]

    def get_video_job(self, job_id: UUID) -> VideoGenerationJob:
        return self.video_jobs[job_id]


store = InMemoryStore()
