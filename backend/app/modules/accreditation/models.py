from datetime import date, datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    String,
    Text,
    Uuid,
)
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ...db.base import Base
from ..study_programmes.models import ProgrammeVersion
from .enums import AccreditationProcessType, ApprovalRegime


class AccreditationProcess(Base):
    __tablename__ = "accreditation_processes"
    __table_args__ = (
        CheckConstraint(
            "submitted_at IS NULL OR submitted_at >= started_at",
            name="ck_accreditation_processes_submitted_at_after_started_at",
        ),
        CheckConstraint(
            "decided_at IS NULL OR decided_at >= started_at",
            name="ck_accreditation_processes_decided_at_after_started_at",
        ),
        CheckConstraint(
            "submitted_at IS NULL OR decided_at IS NULL OR decided_at >= submitted_at",
            name="ck_accreditation_processes_decided_at_after_submitted_at",
        ),
    )

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    programme_version_id: Mapped[UUID] = mapped_column(
        Uuid,
        ForeignKey("programme_versions.id", ondelete="RESTRICT"),
        nullable=False,
    )
    process_type: Mapped[AccreditationProcessType] = mapped_column(
        SqlEnum(AccreditationProcessType, name="accreditation_process_type"),
        nullable=False,
    )
    approval_regime: Mapped[ApprovalRegime] = mapped_column(
        SqlEnum(ApprovalRegime, name="approval_regime"),
        nullable=False,
    )
    status: Mapped[str] = mapped_column(String(100), nullable=False)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    submitted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    decided_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    external_reference: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    programme_version: Mapped[ProgrammeVersion] = relationship(
        back_populates="accreditation_processes",
    )
    decisions: Mapped[list["Decision"]] = relationship(
        back_populates="accreditation_process",
        passive_deletes=True,
    )


class Decision(Base):
    __tablename__ = "accreditation_decisions"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    accreditation_process_id: Mapped[UUID] = mapped_column(
        Uuid,
        ForeignKey("accreditation_processes.id", ondelete="RESTRICT"),
        nullable=False,
    )
    authority: Mapped[str] = mapped_column(String(100), nullable=False)
    decision_type: Mapped[str] = mapped_column(String(100), nullable=False)
    decided_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    valid_until: Mapped[date | None] = mapped_column(Date, nullable=True)
    conditions: Mapped[str | None] = mapped_column(Text, nullable=True)
    reference: Mapped[str | None] = mapped_column(String(255), nullable=True)

    accreditation_process: Mapped[AccreditationProcess] = relationship(
        back_populates="decisions",
    )