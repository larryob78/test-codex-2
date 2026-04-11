from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class TaskStatus(str, Enum):
    pending = "pending"
    running = "running"
    succeeded = "succeeded"
    failed = "failed"


@dataclass
class TaskRecord:
    name: str
    status: TaskStatus
    attempts: int = 0


class TaskLog:
    def __init__(self) -> None:
        self.records: list[TaskRecord] = []

    def add(self, name: str, status: TaskStatus, attempts: int = 0) -> None:
        self.records.append(TaskRecord(name=name, status=status, attempts=attempts))
