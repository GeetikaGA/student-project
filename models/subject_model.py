from pydantic import BaseModel, Field, computed_field
from typing import Optional, Literal, Annotated

class Subject(BaseModel):
    subject_id: int
    subject_name: str

class SubjectUpdate(BaseModel):
    subject_name: Optional[str] = None
