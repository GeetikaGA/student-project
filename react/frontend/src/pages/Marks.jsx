import { useState, useEffect } from "react";
import { marksAPI, studentsAPI, subjectsAPI } from "../services/api.js";
import MarkForm from "../components/MarksForm.jsx";
import Loading from "../components/Loading.jsx";

function Marks() {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMark, setSelectedMark] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const fetchAllData = async () => {
    setLoading(true);
    setError("");
    try {
      const [marksRes, studentsRes, subjectsRes] = await Promise.all([
        marksAPI.getAll(),
        studentsAPI.getAll(),
        subjectsAPI.getAll(),
      ]);
      setMarks(marksRes.data);
      setStudents(studentsRes.data);
      setSubjects(subjectsRes.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load marks data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setSelectedMark(null);
    setShowForm(true);
  };

  const handleEditClick = (mark) => {
    setIsEditMode(true);
    setSelectedMark(mark);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedMark(null);
  };

  const handleFormSubmit = async (formData) => {
    setError("");
    try {
      if (isEditMode) {
        await marksAPI.update(
          formData.student_id,
          formData.subject_id,
          formData.mark
        );
        setSuccessMessage("Mark updated successfully.");
      } else {
        await marksAPI.create(formData);
        setSuccessMessage("Mark added successfully.");
      }
      setShowForm(false);
      setSelectedMark(null);
      fetchAllData();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to save mark. Please try again."
      );
    }
  };

  const handleDelete = async (studentId, subjectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this mark? This cannot be undone."
    );
    if (!confirmed) return;

    setError("");
    try {
      await marksAPI.delete(studentId, subjectId);
      setSuccessMessage("Mark deleted successfully.");
      fetchAllData();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to delete mark. Please try again."
      );
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 className="mb-0">Marks</h2>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary rounded-pill"
              onClick={fetchAllData}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh
            </button>
            <button
              className="btn btn-primary rounded-pill"
              onClick={handleAddClick}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Add Mark
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {successMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMessage("")}
            ></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
            ></button>
          </div>
        )}

        {loading ? (
          <Loading message="Loading marks..." />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Student Name</th>
                  <th>Subject Name</th>
                  <th>Mark</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {marks.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No marks found.
                    </td>
                  </tr>
                ) : (
                  // Backend's /marks query aliases the student's name as `name`
                  // and does not return subject_id, so it's resolved once per
                  // row here (by matching subject_name) and reused below.
                  marks.map((row) => {
                    const subject = subjects.find(
                      (s) => s.subject_name === row.subject_name
                    );

                    return (
                      <tr key={`${row.student_id}-${row.subject_name}`}>
                        <td>{row.name}</td>
                        <td>{row.subject_name}</td>
                        <td>{row.mark}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary rounded-pill me-2"
                            onClick={() =>
                              handleEditClick({
                                student_id: row.student_id,
                                subject_id: subject?.subject_id,
                                mark: row.mark,
                              })
                            }
                          >
                            <i className="bi bi-pencil-fill me-1"></i>
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill"
                            onClick={() =>
                              handleDelete(row.student_id, subject?.subject_id)
                            }
                          >
                            <i className="bi bi-trash-fill me-1"></i>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MarkForm
        show={showForm}
        isEditMode={isEditMode}
        initialData={selectedMark}
        students={students}
        subjects={subjects}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
      />
    </div>
  );
}

export default Marks;