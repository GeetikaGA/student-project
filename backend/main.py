from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from models.student_model import Student
from models.subject_model import Subject
from models.marks_model import Mark, MarkUpdate

from routers.student_router import router as student_router
from routers.subject_router import router as subject_router
from routers.marks_router import router as marks_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student_router)
app.include_router(subject_router)
app.include_router(marks_router)


@app.get("/")
def home():
    return {"message": "Student Management API"}







