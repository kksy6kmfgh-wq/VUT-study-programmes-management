from datetime import date
from uuid import UUID

from pydantic import BaseModel, Field, field_validator, model_validator

from .enums import RequirementType


class Requirement(BaseModel):
    """One versioned requirement record identified by a stable code."""

    id: UUID
    code: str
    requirement_type: RequirementType
    title: str
    description: str
    valid_from: date
    valid_to: date | None = None
    version: int = Field(gt=0)

    @field_validator("code", "title", "description")
    @classmethod
    def must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("must not be empty or whitespace-only")
        return value

    @model_validator(mode="after")
    def validate_date_range(self) -> "Requirement":
        if self.valid_to is not None and self.valid_to < self.valid_from:
            raise ValueError("valid_to must not be earlier than valid_from")
        return self