from models.subject_model import Subject , SubjectUpdate
from fastapi import APIRouter , HTTPException
router = APIRouter()
from db import get_connection

@router.get("/subjects/{subject_id}")
def get_subject(subject_id : int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM subject WHERE subject_id = %s",
                   (subject_id,)
                   )
    subject = cursor.fetchone()

    cursor.close()
    conn.close()

    if subject is None:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    return subject


@router.get("/subjects")
def get_subjects():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM subject")
    data = cursor.fetchall()

    conn.close()
    return data


@router.post("/subjects")
def create_subject(subject: Subject):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT subject_id
        FROM subject
        WHERE subject_id = %s
        """,
        (subject.subject_id,)
    )

    existing_subject = cursor.fetchone()

    if existing_subject:
        cursor.close()
        conn.close()

        raise HTTPException(
            status_code=400,
            detail="Subject already exists"
        )

    cursor.execute(
        """
        INSERT INTO subject
        (subject_id, subject_name)
        VALUES (%s, %s)
        """,
        (
            subject.subject_id,
            subject.subject_name
        )
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Subject created successfully"
    }

@router.put("/subjects/{subject_id}")
def update_subject(
    subject_id: int,
    subject_update: SubjectUpdate
):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM subject WHERE subject_id = %s",
        (subject_id,)
    )

    existing_subject = cursor.fetchone()

    if existing_subject is None:
        cursor.close()
        conn.close()

        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    update_data = subject_update.model_dump(
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

    values.append(subject_id)

    query = f"""
    UPDATE SUBJECT
    SET {", ".join(fields)}
    WHERE subject_id = %s
    """

    cursor.execute(query, values)

    conn.commit()
    cursor.close()
    conn.close()

    return {
        "message": "Subject updated successfully"
    }

@router.delete("/subjects/{subject_id}")
def delete_subject(subject_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT subject_id FROM subject WHERE subject_id = %s",
        (subject_id,)
    )

    subject = cursor.fetchone()

    if not subject:
        cursor.close()
        conn.close()
        
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    cursor.execute(
        "DELETE FROM subject WHERE subject_id = %s",
        (subject_id,)
    )

    conn.commit()
    cursor.close()
    conn.close()
    

    return {
        "message": "Subject deleted successfully"
    }

