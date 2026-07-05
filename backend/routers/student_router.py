from models.student_model import Student , StudentUpdate
from fastapi import APIRouter , HTTPException
router = APIRouter()
from db import get_connection

@router.get("/students") #get all students 
def get_students():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM students")
    data = cursor.fetchall()

    conn.close()
    return data


@router.get("/students/{student_id}")
def get_student(student_id: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM students WHERE id = %s",
        (student_id,)
    )

    student = cursor.fetchone()
    conn.close()
    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return student

@router.post("/create")
def create_student(student: Student):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM students WHERE id = %s",
        (student.id,)
    )

    existing_student = cursor.fetchone()

    if existing_student:
        conn.close()

        raise HTTPException(
            status_code=400,
            detail="Student already exists"
        )

    query = """
    INSERT INTO students
    (id, name, age, gender, height, weight)
    VALUES (%s, %s, %s, %s, %s, %s)
    """

    values = (
        student.id,
        student.name,
        student.age,
        student.gender,
        student.height,
        student.weight
    )

    cursor.execute(query, values)
    conn.commit()
    conn.close()

    return {
        "message": "Student created successfully"
    }

@router.delete("/delete/{student_id}")
def delete_student(student_id: str):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM students WHERE id = %s",
        (student_id,)
    )

    student = cursor.fetchone()

    if not student:
        conn.close()

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    cursor.execute(
        "DELETE FROM students WHERE id = %s",
        (student_id,)
    )

    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        "message": "Student deleted successfully"
    }

@router.put("/edit/{student_id}")
def update_student(
    student_id: str,
    student_update: StudentUpdate
):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM students WHERE id = %s",
        (student_id,)
    )

    existing_student = cursor.fetchone()

    if existing_student is None:
        cursor.close()
        conn.close()

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    update_data = student_update.model_dump(
        exclude_unset=True
    )

    if not update_data:
        cursor.close()
        conn.close()

        return {
            "message": "Nothing to update"
        }

    fields = []
    values = []

    for key, value in update_data.items():
        fields.append(f"{key} = %s")
        values.append(value)

    values.append(student_id)

    query = f"""
    UPDATE students
    SET {", ".join(fields)}
    WHERE id = %s
    """

    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()

    return {
        "message": "Student updated successfully"
    }


@router.get("/report-card/{student_id}")
def get_report_card(student_id: str):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT
        s.id,
        s.name,
        sub.subject_name,
        m.mark
    FROM marks m
    JOIN students s
        ON m.student_id = s.id
    JOIN subject sub
        ON m.subject_id = sub.subject_id
    WHERE s.id = %s
    """

    cursor.execute(query, (student_id,))
    rows = cursor.fetchall()
    conn.close()
    cursor.close()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    result = {
        "student_id": rows[0]["id"],
        "name": rows[0]["name"],
        "subjects": []
    }

    for row in rows:
        result["subjects"].append(
            {
                "subject": row["subject_name"],
                "mark": row["mark"]
            }
        )

    return result






