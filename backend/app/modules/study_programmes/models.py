from datetime import date, datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    String,
    UniqueConstraint,
    Uuid,
)
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ...db.base import Base
from .enums import ProgrammeVersionStatus


class StudyProgramme(Base):
    __tablename__ = "study_programmes"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name_cs: Mapped[str] = mapped_column(String(255), nullable=False)
    name_en: Mapped[str] = mapped_column(String(255), nullable=False)
    degree_type: Mapped[str] = mapped_column(String(100), nullable=False)
    faculty: Mapped[str] = mapped_column(String(255), nullable=False)
    active: Mapped[bool] = mapped_column(nullable=False, default=True)

    versions: Mapped[list["ProgrammeVersion"]] = relationship(
        back_populates="study_programme",
        passive_deletes=True,
    )


class ProgrammeVersion(Base):
    __tablename__ = "programme_versions"
    __table_args__ = (
        CheckConstraint(
            "version_number > 0",
            name="ck_programme_versions_version_number_positive",
        ),
        UniqueConstraint(
            "study_programme_id",
            "version_number",
            name="uq_programme_versions_programme_version_number",
        ),
    )

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    study_programme_id: Mapped[UUID] = mapped_column(
        Uuid,
        ForeignKey("study_programmes.id", ondelete="RESTRICT"),
        nullable=False,
    )
    version_number: Mapped[int] = mapped_column(nullable=False)
    status: Mapped[ProgrammeVersionStatus] = mapped_column(
        SqlEnum(ProgrammeVersionStatus, name="programme_version_status"),
        nullable=False,
    )
    valid_from: Mapped[date] = mapped_column(Date, nullable=False)
    valid_to: Mapped[date | None] = mapped_column(Date, nullable=True)
    planned_effective_academic_year: Mapped[str] = mapped_column(
        String(9),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    study_programme: Mapped[StudyProgramme] = relationship(
        back_populates="versions",
    )