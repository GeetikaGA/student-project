import { useState, useEffect } from "react";

// initialData is null for "Add" mode, or a student object for "Edit" mode.
// isEditMode disables the Student ID field since the backend has no
// endpoint to change a student's primary key.
function StudentForm({ show, isEditMode, initialData, onSubmit, onClose }) {
  const emptyForm = {
    id: "",
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Reset/populate the form whenever the modal is opened for a new target
  useEffect(() => {
    if (show) {
      setFormData(
        initialData
          ? {
              id: initialData.id ?? "",
              name: initialData.name ?? "",
              age: initialData.age ?? "",
              gender: initialData.gender ?? "",
              height: initialData.height ?? "",
              weight: initialData.weight ?? "",
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

    if (!formData.id.trim()) newErrors.id = "Student ID is required.";
    if (!formData.name.trim()) newErrors.name = "Name is required.";

    if (formData.age === "" || isNaN(formData.age)) {
      newErrors.age = "Age must be a number.";
    } else if (Number(formData.age) <= 0 || Number(formData.age) >= 80) {
      newErrors.age = "Age must be between 1 and 79.";
    }

    if (!formData.gender) newErrors.gender = "Gender is required.";

    if (formData.height === "" || isNaN(formData.height)) {
      newErrors.height = "Height must be a number.";
    } else if (Number(formData.height) <= 0) {
      newErrors.height = "Height must be greater than 0.";
    }

    if (formData.weight === "" || isNaN(formData.weight)) {
      newErrors.weight = "Weight must be a number.";
    } else if (Number(formData.weight) <= 0) {
      newErrors.weight = "Weight must be greater than 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Cast numeric fields before sending to the backend
    onSubmit({
      id: formData.id.trim(),
      name: formData.name.trim(),
      age: Number(formData.age),
      gender: formData.gender,
      height: Number(formData.height),
      weight: Number(formData.weight),
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
                  {isEditMode ? "Edit Student" : "Add Student"}
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
                  <label htmlFor="id" className="form-label">
                    Student ID
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    className={`form-control ${errors.id ? "is-invalid" : ""}`}
                    value={formData.id}
                    onChange={handleChange}
                    disabled={isEditMode}
                    placeholder="e.g. S001"
                  />
                  {errors.id && (
                    <div className="invalid-feedback">{errors.id}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label htmlFor="age" className="form-label">
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      className={`form-control ${errors.age ? "is-invalid" : ""}`}
                      value={formData.age}
                      onChange={handleChange}
                    />
                    {errors.age && (
                      <div className="invalid-feedback">{errors.age}</div>
                    )}
                  </div>

                  <div className="col-6 mb-3">
                    <label htmlFor="gender" className="form-label">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                    {errors.gender && (
                      <div className="invalid-feedback">{errors.gender}</div>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label htmlFor="height" className="form-label">
                      Height (m)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="height"
                      name="height"
                      className={`form-control ${errors.height ? "is-invalid" : ""}`}
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="e.g. 1.75"
                    />
                    {errors.height && (
                      <div className="invalid-feedback">{errors.height}</div>
                    )}
                  </div>

                  <div className="col-6 mb-3">
                    <label htmlFor="weight" className="form-label">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="weight"
                      name="weight"
                      className={`form-control ${errors.weight ? "is-invalid" : ""}`}
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="e.g. 70"
                    />
                    {errors.weight && (
                      <div className="invalid-feedback">{errors.weight}</div>
                    )}
                  </div>
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

      {/* Backdrop rendered separately since we're not using data-bs-toggle */}
      <div className="modal-backdrop show"></div>
    </>
  );
}

export default StudentForm;