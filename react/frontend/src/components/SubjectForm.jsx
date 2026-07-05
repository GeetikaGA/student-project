import { useState, useEffect } from "react";

// initialData is null for "Add" mode, or a subject object for "Edit" mode.
// isEditMode disables Subject ID since it's the primary key and the
// backend has no endpoint to change it.
function SubjectForm({ show, isEditMode, initialData, onSubmit, onClose }) {
  const emptyForm = {
    subject_id: "",
    subject_name: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      setFormData(
        initialData
          ? {
              subject_id: initialData.subject_id ?? "",
              subject_name: initialData.subject_name ?? "",
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

    if (formData.subject_id === "" || isNaN(formData.subject_id)) {
      newErrors.subject_id = "Subject ID must be a number.";
    }

    if (!formData.subject_name.trim()) {
      newErrors.subject_name = "Subject name is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      subject_id: Number(formData.subject_id),
      subject_name: formData.subject_name.trim(),
    });
  };

  if (!show) return null;

  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <form onSubmit={handleSubmit} noValidate>
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditMode ? "Edit Subject" : "Add Subject"}
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
                  <label htmlFor="subject_id" className="form-label">
                    Subject ID
                  </label>
                  <input
                    type="number"
                    id="subject_id"
                    name="subject_id"
                    className={`form-control ${
                      errors.subject_id ? "is-invalid" : ""
                    }`}
                    value={formData.subject_id}
                    onChange={handleChange}
                    disabled={isEditMode}
                    placeholder="e.g. 101"
                  />
                  {errors.subject_id && (
                    <div className="invalid-feedback">{errors.subject_id}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="subject_name" className="form-label">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    id="subject_name"
                    name="subject_name"
                    className={`form-control ${
                      errors.subject_name ? "is-invalid" : ""
                    }`}
                    value={formData.subject_name}
                    onChange={handleChange}
                    placeholder="e.g. Mathematics"
                  />
                  {errors.subject_name && (
                    <div className="invalid-feedback">
                      {errors.subject_name}
                    </div>
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

export default SubjectForm;