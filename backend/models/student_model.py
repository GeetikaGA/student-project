from pydantic import BaseModel, Field, computed_field
from typing import Optional, Literal, Annotated

class Student(BaseModel):
    id: Annotated[
        str,
        Field(..., description="The unique identifier for the student", examples=["S001"])
    ]

    name: Annotated[
        str,
        Field(..., description="The name of the student", examples=["John Doe"])
    ]

    age: Annotated[
        int,
        Field(..., gt=0, lt=80, description="The age of the student", examples=[20])
    ]

    gender: Annotated[
        Literal["Male", "Female", "Others"],
        Field(..., description="The gender of the student", examples=["Male"])
    ]

    height: Annotated[
        float,
        Field(..., gt=0, description="Height in meters", examples=[1.75])
    ]

    weight: Annotated[
        float,
        Field(..., gt=0, description="Weight in kilograms", examples=[70.0])
    ]

    @computed_field
    @property
    def bmi(self) -> float:
        return round(self.weight / (self.height ** 2), 2)

    @computed_field
    @property
    def verdict(self) -> str:
        if self.bmi < 18.5:
            return "Underweight"
        elif self.bmi < 25:
            return "Normal"
        else:
            return "Overweight"

class StudentUpdate(BaseModel):
        name: Annotated[Optional[str], Field(None, description="The name of the student", examples=["John Doe"])]
        age: Annotated[Optional[int], Field(None, gt=0, lt=80, description="The age of the student", examples=[20])]
        gender: Annotated[Optional[Literal["Male", "Female", "Others"]], Field(None, description="The gender of the student", examples=["Male"])]
        height: Annotated[Optional[float], Field(None, gt=0, description="Height in meters", examples=[1.75])]
        weight: Annotated[Optional[float], Field(None, gt=0, description="Weight in kilograms", examples=[70.0])]
