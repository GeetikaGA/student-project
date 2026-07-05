import { useState, useEffect } from "react";
import { subjectsAPI } from "../services/api.js";
import SubjectForm from "../components/SubjectForm.jsx";
import Loading from "../components/Loading.jsx";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const fetchSubjects = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await subjectsAPI.getAll();
      setSubjects(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to load subjects. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setSelectedSubject(null);
    setShowForm(true);
  };

  const handleEditClick = (subject) => {
    setIsEditMode(true);
    setSelectedSubject(subject);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedSubject(null);
  };

  const handleFormSubmit = async (formData) => {
    setError("");
    try {
      if (isEditMode) {
        // SubjectUpdate only accepts subject_name
        await subjectsAPI.update(formData.subject_id, {
          subject_name: formData.subject_name,
        });
        setSuccessMessage("Subject updated successfully.");
      } else {
        await subjectsAPI.create(formData);
        setSuccessMessage("Subject created successfully.");
      }
      setShowForm(false);
      setSelectedSubject(null);
      fetchSubjects();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to save subject. Please try again."
      );
    }
  };

  const handleDelete = async (subjectId) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete subject ID "${subjectId}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setError("");
    try {
      await subjectsAPI.delete(subjectId);
      setSuccessMessage("Subject deleted successfully.");
      fetchSubjects();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to delete subject. Please try again."
      );
    }
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.subject_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 className="mb-0">Subjects</h2>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary rounded-pill"
              onClick={fetchSubjects}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh
            </button>
            <button
              className="btn btn-primary rounded-pill"
              onClick={handleAddClick}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Add Subject
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
              placeholder="Search by subject name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <Loading message="Loading subjects..." />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Subject ID</th>
                  <th>Subject Name</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">
                      No subjects found.
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map((subject) => (
                    <tr key={subject.subject_id}>
                      <td>{subject.subject_id}</td>
                      <td>{subject.subject_name}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary rounded-pill me-2"
                          onClick={() => handleEditClick(subject)}
                        >
                          <i className="bi bi-pencil-fill me-1"></i>
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill"
                          onClick={() => handleDelete(subject.subject_id)}
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

      <SubjectForm
        show={showForm}
        isEditMode={isEditMode}
        initialData={selectedSubject}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
      />
    </div>
  );
}

export default Subjects;