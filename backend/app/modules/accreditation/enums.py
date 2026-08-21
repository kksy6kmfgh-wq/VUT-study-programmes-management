from enum import StrEnum


class AccreditationProcessType(StrEnum):
    NEW_PROGRAMME = "NEW_PROGRAMME"
    REACCREDITATION = "REACCREDITATION"
    PROGRAMME_CHANGE = "PROGRAMME_CHANGE"


class ApprovalRegime(StrEnum):
    INSTITUTIONAL = "INSTITUTIONAL"
    EXTERNAL_NAU = "EXTERNAL_NAU"