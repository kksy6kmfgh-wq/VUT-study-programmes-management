from datetime import datetime, timezone
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Column, DateTime, ForeignKey, String, Table, Text, Uuid
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ...db.base import Base
from .enums import EvidenceType

if TYPE_CHECKING:
    from ..assessments.models import Assessment


assessment_evidence = Table(
    "assessment_evidence",
    Base.metadata,
    Column(
        "assessment_id",
        Uuid,
        ForeignKey("assessments.id", ondelete="RESTRICT"),
        primary_key=True,
        nullable=False,
    ),
    Column(
        "evidence_id",
        Uuid,
        ForeignKey("evidence.id", ondelete="RESTRICT"),
        primary_key=True,
        nullable=False,
    ),
)


class Evidence(Base):
    __tablename__ = "evidence"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    evidence_type: Mapped[EvidenceType] = mapped_column(
        SqlEnum(EvidenceType, name="evidence_type"),
        nullable=False,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    source: Mapped[str] = mapped_column(String(255), nullable=False)
    reference: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    assessments: Mapped[list["Assessment"]] = relationship(
        secondary=assessment_evidence,
        back_populates="evidence",
        passive_deletes=True,
    )