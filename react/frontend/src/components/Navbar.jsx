import { NavLink } from "react-router-dom";

function Navbar() {
  // Centralized nav items so links aren't duplicated in JSX below
  const navItems = [
    { path: "/students", label: "Students", icon: "bi-people-fill" },
    { path: "/subjects", label: "Subjects", icon: "bi-book-fill" },
    { path: "/marks", label: "Marks", icon: "bi-clipboard-data-fill" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <NavLink to="/students" className="navbar-brand fw-semibold">
          <i className="bi bi-mortarboard-fill me-2"></i>
          Student Management System
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link px-3 ${isActive ? "active fw-semibold text-white" : ""}`
                  }
                >
                  <i className={`bi ${item.icon} me-1`}></i>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;