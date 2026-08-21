from datetime import date
from uuid import UUID, uuid4

from sqlalchemy import CheckConstraint, Date, Text, UniqueConstraint, Uuid
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column

from ...db.base import Base
from .enums import RequirementType


class Requirement(Base):
    __tablename__ = "requirements"
    __table_args__ = (
        CheckConstraint(
            "version > 0",
            name="ck_requirements_version_positive",
        ),
        CheckConstraint(
            "valid_to IS NULL OR valid_to >= valid_from",
            name="ck_requirements_valid_to_after_valid_from",
        ),
        UniqueConstraint(
            "code",
            "version",
            name="uq_requirements_code_version",
        ),
    )

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    code: Mapped[str] = mapped_column(Text, nullable=False)
    requirement_type: Mapped[RequirementType] = mapped_column(
        SqlEnum(RequirementType, name="requirement_type"),
        nullable=False,
    )
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    valid_from: Mapped[date] = mapped_column(Date, nullable=False)
    valid_to: Mapped[date | None] = mapped_column(Date, nullable=True)
    version: Mapped[int] = mapped_column(nullable=False)