import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Students from "./pages/Students.jsx";
import Subjects from "./pages/Subjects.jsx";
import Marks from "./pages/Marks.jsx";

function App() {
  return (
    <>
      <Navbar />

      <div className="container-fluid py-4">
        <Routes>
          {/* Default route -> Students page */}
          <Route path="/" element={<Navigate to="/students" replace />} />

          <Route path="/students" element={<Students />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/marks" element={<Marks />} />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/students" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;