from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ...db.base import Base
from ..evidence.models import Evidence, assessment_evidence


class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    requirement_id: Mapped[UUID] = mapped_column(
        Uuid,
        ForeignKey("requirements.id", ondelete="RESTRICT"),
        nullable=False,
    )
    context_type: Mapped[str] = mapped_column(String(100), nullable=False)
    context_id: Mapped[UUID] = mapped_column(Uuid, nullable=False)
    assessor: Mapped[str] = mapped_column(String(255), nullable=False)
    result: Mapped[str] = mapped_column(String(100), nullable=False)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    assessed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    evidence: Mapped[list[Evidence]] = relationship(
        secondary=assessment_evidence,
        back_populates="assessments",
        passive_deletes=True,
    )