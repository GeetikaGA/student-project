import axios from "axios";

// Single Axios instance pointing at the FastAPI backend.
// Base URL is configurable via .env (VITE_API_BASE_URL) without touching code.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------
// Students
// Backend routes are NOT fully RESTful — paths match student_router.py exactly.
// ----------------------
export const studentsAPI = {
  getAll: () => apiClient.get("/students"),
  getById: (studentId) => apiClient.get(`/students/${studentId}`),
  create: (studentData) => apiClient.post("/create", studentData),
  update: (studentId, studentData) =>
    apiClient.put(`/edit/${studentId}`, studentData),
  delete: (studentId) => apiClient.delete(`/delete/${studentId}`),
};

// ----------------------
// Subjects
// Backend routes here ARE RESTful (subject_router.py).
// ----------------------
export const subjectsAPI = {
  getAll: () => apiClient.get("/subjects"),
  getById: (subjectId) => apiClient.get(`/subjects/${subjectId}`),
  create: (subjectData) => apiClient.post("/subjects", subjectData),
  update: (subjectId, subjectData) =>
    apiClient.put(`/subjects/${subjectId}`, subjectData),
  delete: (subjectId) => apiClient.delete(`/subjects/${subjectId}`),
};

// ----------------------
// Marks
// Composite key (student_id, subject_id) — no single mark id exists.
// Update only ever sends { mark }, since that's all MarkUpdate supports.
// ----------------------
export const marksAPI = {
  getAll: () => apiClient.get("/marks"),
  getOne: (studentId, subjectId) =>
    apiClient.get(`/marks/${studentId}/${subjectId}`),
  create: (markData) => apiClient.post("/marks", markData),
  update: (studentId, subjectId, mark) =>
    apiClient.put(`/marks/${studentId}/${subjectId}`, { mark }),
  delete: (studentId, subjectId) =>
    apiClient.delete(`/marks/${studentId}/${subjectId}`),
};

export default apiClient;