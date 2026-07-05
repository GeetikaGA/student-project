import { useState, useEffect } from "react";
import { studentsAPI } from "../services/api.js";
import StudentForm from "../components/StudentForm.jsx";
import Loading from "../components/Loading.jsx";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  // Auto-dismiss success alerts after a few seconds
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await studentsAPI.getAll();
      setStudents(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load students. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setSelectedStudent(null);
    setShowForm(true);
  };

  const handleEditClick = (student) => {
    setIsEditMode(true);
    setSelectedStudent(student);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedStudent(null);
  };

  const handleFormSubmit = async (formData) => {
    setError("");
    try {
      if (isEditMode) {
        // id is not part of StudentUpdate, only the mutable fields
        const { id, ...updatePayload } = formData;
        await studentsAPI.update(id, updatePayload);
        setSuccessMessage("Student updated successfully.");
      } else {
        await studentsAPI.create(formData);
        setSuccessMessage("Student created successfully.");
      }
      setShowForm(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to save student. Please try again."
      );
    }
  };

  const handleDelete = async (studentId) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete student "${studentId}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setError("");
    try {
      await studentsAPI.delete(studentId);
      setSuccessMessage("Student deleted successfully.");
      fetchStudents();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to delete student. Please try again."
      );
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 className="mb-0">Students</h2>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary rounded-pill"
              onClick={fetchStudents}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh
            </button>
            <button
              className="btn btn-primary rounded-pill"
              onClick={handleAddClick}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Add Student
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

        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <Loading message="Loading students..." />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Height (m)</th>
                  <th>Weight (kg)</th>
                  <th>BMI</th>
                  <th>Verdict</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.age}</td>
                      <td>{student.gender}</td>
                      <td>{student.height}</td>
                      <td>{student.weight}</td>
                      <td>{student.bmi}</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            student.verdict === "Normal"
                              ? "bg-success"
                              : student.verdict === "Underweight"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                        >
                          {student.verdict}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary rounded-pill me-2"
                          onClick={() => handleEditClick(student)}
                        >
                          <i className="bi bi-pencil-fill me-1"></i>
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill"
                          onClick={() => handleDelete(student.id)}
                        >
                          <i className="bi bi-trash-fill me-1"></i>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <StudentForm
        show={showForm}
        isEditMode={isEditMode}
        initialData={selectedStudent}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
      />
    </div>
  );
}

export default Students;