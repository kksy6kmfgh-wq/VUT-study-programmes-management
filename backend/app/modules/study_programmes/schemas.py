from datetime import date, datetime
import re
from uuid import UUID

from pydantic import BaseModel, Field, field_validator, model_validator

from .enums import ProgrammeVersionStatus


class StudyProgramme(BaseModel):
    id: UUID
    code: str
    name_cs: str
    name_en: str
    degree_type: str
    faculty: str
    active: bool

    @field_validator("code", "name_cs", "name_en")
    @classmethod
    def must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("must not be empty or whitespace-only")
        return value


class ProgrammeVersion(BaseModel):
    id: UUID
    study_programme_id: UUID
    version_number: int = Field(gt=0)
    status: ProgrammeVersionStatus
    valid_from: date
    valid_to: date | None = None
    planned_effective_academic_year: str
    created_at: datetime
    updated_at: datetime

    @field_validator("planned_effective_academic_year")
    @classmethod
    def validate_academic_year(cls, value: str) -> str:
        match = re.fullmatch(r"(\d{4})/(\d{4})", value)
        if match is None or int(match.group(2)) != int(match.group(1)) + 1:
            raise ValueError("must use the format YYYY/YYYY with consecutive years")
        return value

    @model_validator(mode="after")
    def validate_date_range(self) -> "ProgrammeVersion":
        if self.valid_to is not None and self.valid_to < self.valid_from:
            raise ValueError("valid_to must not be earlier than valid_from")
        return self