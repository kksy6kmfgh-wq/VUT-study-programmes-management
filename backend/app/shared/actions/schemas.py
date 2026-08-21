from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, field_validator, model_validator


class Action(BaseModel):
    id: UUID
    finding_id: UUID
    title: str
    description: str
    responsible: str
    due_date: date | None = None
    status: str
    created_at: datetime
    completed_at: datetime | None = None

    @field_validator("title", "description", "responsible", "status")
    @classmethod
    def must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("must not be empty or whitespace-only")
        return value

    @model_validator(mode="after")
    def validate_completion_time(self) -> "Action":
        if self.completed_at is not None and self.completed_at < self.created_at:
            raise ValueError("completed_at must not be earlier than created_at")
        return self