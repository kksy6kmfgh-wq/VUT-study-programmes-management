from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, field_validator


class Finding(BaseModel):
    id: UUID
    finding_type: str
    title: str
    description: str
    source_context_type: str
    source_context_id: UUID
    created_at: datetime
    status: str

    @field_validator(
        "finding_type",
        "title",
        "description",
        "source_context_type",
        "status",
    )
    @classmethod
    def must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("must not be empty or whitespace-only")
        return value