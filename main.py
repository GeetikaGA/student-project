from fastapi import FastAPI, Path, HTTPException, Query
from fastapi.responses import JSONResponse

from models.student_model import Student
from models.subject_model import Subject
from models.marks_model import Mark, MarkUpdate


from routers.student_router import router as student_router
from routers.subject_router import router as subject_router
from routers.marks_router import router as marks_router

from db import get_connection

app = FastAPI()

app.include_router(student_router)
app.include_router(subject_router)
app.include_router(marks_router)


@app.get("/")
def home():
    return {"message": "Student Management API"}







