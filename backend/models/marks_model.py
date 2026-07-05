from pydantic import BaseModel, Field
from typing import Optional, Annotated


class Mark(BaseModel):
    student_id: str
    subject_id: int

    mark: Annotated[
        int,
        Field(
            ge=0,
            le=100,
            description="Student mark"
        )
    ]

class MarkUpdate(BaseModel):
    mark: Optional[
        Annotated[
            int,
            Field(ge=0, le=100)
        ]
    ] = None


