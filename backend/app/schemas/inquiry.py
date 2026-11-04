import re
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

# Philippine mobile: 09171234567, +639171234567 or 639171234567 (spaces/dashes tolerated).
PH_MOBILE = re.compile(r"^(\+?63|0)9\d{9}$")


class InquiryCreate(BaseModel):
    kind: Literal["inquiry", "quote"] = "inquiry"
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    phone: str
    message: str = Field(default="", max_length=2000)
    property_slug: str | None = Field(default=None, max_length=120)
    unit_type_pref: str | None = Field(default=None, max_length=80)
    website: str = ""  # honeypot: real people never fill this hidden field

    @field_validator("first_name", "last_name", "message", mode="before")
    @classmethod
    def _strip(cls, value: object) -> object:
        return value.strip() if isinstance(value, str) else value

    @field_validator("phone")
    @classmethod
    def _check_phone(cls, value: str) -> str:
        cleaned = re.sub(r"[\s-]", "", value)
        if not PH_MOBILE.match(cleaned):
            raise ValueError("Enter a valid Philippine mobile number, e.g. 0917 123 4567")
        return cleaned

    @model_validator(mode="after")
    def _message_required_for_inquiry(self) -> "InquiryCreate":
        if self.kind == "inquiry" and len(self.message) < 10:
            raise ValueError("Please tell us a little more (at least 10 characters)")
        return self


class InquiryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
