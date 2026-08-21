from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, field_validator


class Assessment(BaseModel):
    id: UUID
    requirement_id: UUID
    context_type: str
    context_id: UUID
    assessor: str
    result: str
    comment: str | None = None
    assessed_at: datetime

    @field_validator("context_type", "assessor", "result", "comment")
    @classmethod
    def must_not_be_blank(cls, value: str | None) -> str | None:
        if value is not None and not value.strip():
            raise ValueError("must not be empty or whitespace-only")
        return value