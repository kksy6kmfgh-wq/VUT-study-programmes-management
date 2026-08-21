from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, field_validator, model_validator

from .enums import AccreditationProcessType, ApprovalRegime


class AccreditationProcess(BaseModel):
    id: UUID
    programme_version_id: UUID
    process_type: AccreditationProcessType
    approval_regime: ApprovalRegime
    status: str
    started_at: datetime
    submitted_at: datetime | None = None
    decided_at: datetime | None = None
    external_reference: str | None = None

    @field_validator("status", "external_reference")
    @classmethod
    def must_not_be_blank(cls, value: str | None) -> str | None:
        if value is not None and not value.strip():
            raise ValueError("must not be empty or whitespace-only")
        return value

    @model_validator(mode="after")
    def validate_timestamps(self) -> "AccreditationProcess":
        if self.submitted_at is not None and self.submitted_at < self.started_at:
            raise ValueError("submitted_at must not be earlier than started_at")
        if self.decided_at is not None and self.decided_at < self.started_at:
            raise ValueError("decided_at must not be earlier than started_at")
        if (
            self.submitted_at is not None
            and self.decided_at is not None
            and self.decided_at < self.submitted_at
        ):
            raise ValueError("decided_at must not be earlier than submitted_at")
        return self