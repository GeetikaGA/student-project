from models.marks_model import Mark, MarkUpdate
from fastapi import APIRouter , HTTPException
router = APIRouter()
from db import get_connection

@router.get("/marks")
def get_marks():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT
        s.id AS student_id,
        s.name,
        sub.subject_name,
        m.mark
    FROM marks m
    JOIN students s
        ON m.student_id = s.id
    JOIN subject sub
        ON m.subject_id = sub.subject_id
    """

    cursor.execute(query)

    marks = cursor.fetchall()

    cursor.close()
    conn.close()

    return marks


@router.get("/marks/{student_id}/{subject_id}")
def get_mark(
    student_id: str,
    subject_id: int
):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT *
        FROM marks
        WHERE student_id = %s
        AND subject_id = %s
        """,
        (student_id, subject_id)
    )

    mark = cursor.fetchone()

    cursor.close()
    conn.close()

    if mark is None:
        raise HTTPException(
            status_code=404,
            detail="Mark not found"
        )

    return mark

@router.put("/marks/{student_id}/{subject_id}")
def update_mark(
    student_id: str,
    subject_id: int,
    mark_update: MarkUpdate
):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT *
        FROM marks
        WHERE student_id = %s
        AND subject_id = %s
        """,
        (student_id, subject_id)
    )

    existing_mark = cursor.fetchone()

    if existing_mark is None:
        cursor.close()
        conn.close()

        raise HTTPException(
            status_code=404,
            detail="Mark not found"
        )

    update_data = mark_update.model_dump(
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

    values.extend([student_id, subject_id])

    query = f"""
    UPDATE marks
    SET {", ".join(fields)}
    WHERE student_id = %s
    AND subject_id = %s
    """

    cursor.execute(query, values)

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Mark updated successfully"
    }

@router.post("/marks")
def create_mark(mark: Mark):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Check student exists
    cursor.execute(
        "SELECT id FROM students WHERE id = %s",
        (mark.student_id,)
    )

    student = cursor.fetchone()

    if not student:
        cursor.close()
        conn.close()

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # Check subject exists
    cursor.execute(
        "SELECT subject_id FROM subject WHERE subject_id = %s",
        (mark.subject_id,)
    )

    subject = cursor.fetchone()

    if not subject:
        cursor.close()
        conn.close()

        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    # Check duplicate entry
    cursor.execute(
        """
        SELECT *
        FROM marks
        WHERE student_id = %s
        AND subject_id = %s
        """,
        (
            mark.student_id,
            mark.subject_id
        )
    )

    existing_mark = cursor.fetchone()

    if existing_mark:
        cursor.close()
        conn.close()

        raise HTTPException(
            status_code=400,
            detail="Mark already exists for this subject"
        )

    # Insert mark
    cursor.execute(
        """
        INSERT INTO marks
        (student_id, subject_id, mark)
        VALUES (%s, %s, %s)
        """,
        (
            mark.student_id,
            mark.subject_id,
            mark.mark
        )
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Mark added successfully"
    }


@router.delete("/marks/{student_id}/{subject_id}")
def delete_mark(
    student_id: str,
    subject_id: int
):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT *
        FROM marks
        WHERE student_id = %s
        AND subject_id = %s
        """,
        (student_id, subject_id)
    )

    existing_mark = cursor.fetchone()

    if existing_mark is None:
        cursor.close()
        conn.close()

        raise HTTPException(
            status_code=404,
            detail="Mark not found"
        )

    cursor.execute(
        """
        DELETE FROM marks
        WHERE student_id = %s
        AND subject_id = %s
        """,
        (student_id, subject_id)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Mark deleted successfully"
    }