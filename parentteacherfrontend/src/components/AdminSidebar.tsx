import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isStudentsOpen, setIsStudentsOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [platformName, setPlatformName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetch("http://localhost:5029/api/settings/settings")
        .then((response) => response.json())
        .then((data) => {
          setPlatformName(data.platformName);
          if (data.logoUrl) {
            const apiBaseUrl = "http://localhost:5029"; // Replace with actual backend API URL if needed
            setLogoUrl(
              data.logoUrl.startsWith("http")
                ? data.logoUrl
                : `${apiBaseUrl}${data.logoUrl}`
            );
          }
        })
        .catch((error) => console.error("Error fetching settings:", error));
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    navigate("/login");
  };

  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      {/* Sidebar Brand */}
      <Link
        className="sidebar-brand d-flex align-items-center justify-content-center"
        to="/dashboard"
      >
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo"
            className="mt-2"
            width={60}
            onError={(e) => (e.currentTarget.src = "/default-logo.png")}
          />
        )}
        <div className="sidebar-brand-text mx-3">
          {platformName || "Dashboard"}
        </div>
      </Link>

      <hr className="sidebar-divider my-0" />

      {/* Common for all users */}
      <li className="nav-item">
        <Link className="nav-link" to="/dashboard">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>
      </li>

      <hr className="sidebar-divider" />

      {/* Admin-Specific Links */}
      {role === "Admin" && (
        <>
          <div className="sidebar-heading">Admin Management</div>
          <li className={`nav-item ${isUsersOpen ? "active" : ""}`}>
            <a
              className="nav-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsUsersOpen(!isUsersOpen);
              }}
            >
              <i className="fas fa-fw fa-users"></i>
              <span>User Management </span>
              <i
                className={`fas fa-chevron-${isUsersOpen ? "down" : "right"}`}
              ></i>
            </a>
            {isUsersOpen && (
              <div className="bg-white py-2 collapse-inner rounded collapse show">
                <Link className="dropdown-item" to="/register-admin">
                  New Registration
                </Link>
                <Link className="dropdown-item" to="/manage-users">
                  User List
                </Link>
              </div>
            )}
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin-settings">
              <i className="fas fa-fw fa-cogs"></i>
              <span>Settings</span>
            </Link>
          </li>
        </>
      )}

      {/* Teacher-Specific Links */}
      {role === "Teacher" && (
        <>
          <div className="sidebar-heading">Teacher Features</div>
          <li className={`nav-item ${isStudentsOpen ? "active" : ""}`}>
            <a
              className="nav-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsStudentsOpen(!isStudentsOpen);
              }}
            >
              <i className="fas fa-fw fa-user-graduate"></i>
              <span>Student Management </span>
              <i
                className={`fas fa-chevron-${
                  isStudentsOpen ? "down" : "right"
                }`}
              ></i>
            </a>
            {isStudentsOpen && (
              <div className="bg-white py-2 collapse-inner rounded collapse show">
                <Link className="dropdown-item" to="/teacher-students">
                  Student List
                </Link>
                <Link className="dropdown-item" to="/teacher-attendance">
                  Attendance
                </Link>
              </div>
            )}
          </li>
          <li className={`nav-item ${isAttendanceOpen ? "active" : ""}`}>
            <a
              className="nav-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsAttendanceOpen(!isAttendanceOpen);
              }}
            >
              <i className="fas fa-fw fa-calendar-check"></i>
              <span>Attendance</span>
              <i
                className={`fas fa-chevron-${
                  isAttendanceOpen ? "down" : "right"
                }`}
              ></i>
            </a>
            {isAttendanceOpen && (
              <div className="bg-white py-2 collapse-inner rounded collapse show">
                <Link className="dropdown-item" to="/MarkAttendance">
                  Mark Attendance
                </Link>
                <Link className="dropdown-item" to="/AttendanceHistory">
                  Attendance History
                </Link>
              </div>
            )}
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/teacher-assignments">
              <i className="fas fa-fw fa-tasks"></i>
              <span>Assignments</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/teacher-messages">
              <i className="fas fa-fw fa-envelope"></i>
              <span>Messages</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/teacher-reports">
              <i className="fas fa-fw fa-chart-line"></i>
              <span>Reports</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/teacher-announcements">
              <i className="fas fa-fw fa-bullhorn"></i>
              <span>Announcements</span>
            </Link>
          </li>
        </>
      )}

      {/* Logout */}
      <li className="nav-item">
        <button className="btn btn-outline-light" onClick={handleLogout}>
          Logout
        </button>
      </li>

      <hr className="sidebar-divider d-none d-md-block" />
    </ul>
  );
};

export default Sidebar;
