from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, field_validator

from .enums import EvidenceType


class Evidence(BaseModel):
    id: UUID
    evidence_type: EvidenceType
    title: str
    description: str | None = None
    source: str
    reference: str | None = None
    created_at: datetime

    @field_validator("title", "source", "description", "reference")
    @classmethod
    def must_not_be_blank(cls, value: str | None) -> str | None:
        if value is not None and not value.strip():
            raise ValueError("must not be empty or whitespace-only")
        return value