import { useState, useEffect } from "react";

// students/subjects are passed in from Marks.jsx (already fetched there)
// so this component doesn't duplicate any API calls.
// isEditMode locks Student/Subject since the backend can only update `mark`.
function MarkForm({
  show,
  isEditMode,
  initialData,
  students,
  subjects,
  onSubmit,
  onClose,
}) {
  const emptyForm = {
    student_id: "",
    subject_id: "",
    mark: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      setFormData(
        initialData
          ? {
              student_id: initialData.student_id ?? "",
              subject_id: initialData.subject_id ?? "",
              mark: initialData.mark ?? "",
            }
          : emptyForm
      );
      setErrors({});
    }
  }, [show, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.student_id) newErrors.student_id = "Student is required.";
    if (!formData.subject_id) newErrors.subject_id = "Subject is required.";

    if (formData.mark === "" || isNaN(formData.mark)) {
      newErrors.mark = "Mark must be a number.";
    } else if (Number(formData.mark) < 0 || Number(formData.mark) > 100) {
      newErrors.mark = "Mark must be between 0 and 100.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      student_id: formData.student_id,
      subject_id: Number(formData.subject_id),
      mark: Number(formData.mark),
    });
  };

  // Helper to show a readable label for locked fields in edit mode
  const getStudentLabel = (id) =>
    students.find((s) => s.id === id)?.name ?? id;
  const getSubjectLabel = (id) =>
    subjects.find((s) => s.subject_id === Number(id))?.subject_name ?? id;

  if (!show) return null;

  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditMode ? "Edit Mark" : "Add Mark"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={onClose}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="student_id" className="form-label">
                    Student
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      className="form-control"
                      value={getStudentLabel(formData.student_id)}
                      disabled
                    />
                  ) : (
                    <>
                      <select
                        id="student_id"
                        name="student_id"
                        className={`form-select ${
                          errors.student_id ? "is-invalid" : ""
                        }`}
                        value={formData.student_id}
                        onChange={handleChange}
                      >
                        <option value="">Select a student...</option>
                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.name} ({student.id})
                          </option>
                        ))}
                      </select>
                      {errors.student_id && (
                        <div className="invalid-feedback">
                          {errors.student_id}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="subject_id" className="form-label">
                    Subject
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      className="form-control"
                      value={getSubjectLabel(formData.subject_id)}
                      disabled
                    />
                  ) : (
                    <>
                      <select
                        id="subject_id"
                        name="subject_id"
                        className={`form-select ${
                          errors.subject_id ? "is-invalid" : ""
                        }`}
                        value={formData.subject_id}
                        onChange={handleChange}
                      >
                        <option value="">Select a subject...</option>
                        {subjects.map((subject) => (
                          <option
                            key={subject.subject_id}
                            value={subject.subject_id}
                          >
                            {subject.subject_name}
                          </option>
                        ))}
                      </select>
                      {errors.subject_id && (
                        <div className="invalid-feedback">
                          {errors.subject_id}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="mark" className="form-label">
                    Mark
                  </label>
                  <input
                    type="number"
                    id="mark"
                    name="mark"
                    className={`form-control ${errors.mark ? "is-invalid" : ""}`}
                    value={formData.mark}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    placeholder="0 - 100"
                  />
                  {errors.mark && (
                    <div className="invalid-feedback">{errors.mark}</div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary rounded-pill">
                  {isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal-backdrop show"></div>
    </>
  );
}

export default MarkForm;