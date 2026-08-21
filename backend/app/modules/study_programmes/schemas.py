from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel

from .enums import ProgrammeVersionStatus


class StudyProgramme(BaseModel):
    id: UUID
    code: str
    name_cs: str
    name_en: str
    degree_type: str
    faculty: str
    active: bool


class ProgrammeVersion(BaseModel):
    id: UUID
    study_programme_id: UUID
    version_number: int
    status: ProgrammeVersionStatus
    valid_from: date
    valid_to: date | None = None
    planned_effective_academic_year: str
    created_at: datetime
    updated_at: datetime