import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

const SuperAdminDashboard: React.FC = () => {
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isSchoolOpen, setIsSchoolOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const role = localStorage.getItem("role") || "SuperAdmin";
  const username = localStorage.getItem("username") || "SuperAdmin";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  console.log(role);

  // SignalR notifications
  useEffect(() => {
    if (role === "N/A") return;

    const newConnection = new HubConnectionBuilder()
      .withUrl(`http://localhost:5029/chatHub?role=${role}`)
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR Hub");

        newConnection.on(
          "ReceiveNotification",
          (message: string, targetRole: string) => {
            console.log(
              "🔔 Received Notification:",
              message,
              "Target Role:",
              targetRole
            );
            if (targetRole === "All" || targetRole === role) {
              setNotifications((prev) => [...prev, message]);
            }
          }
        );
      })
      .catch((err) => console.error("SignalR connection error: ", err));

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div id="wrapper" className="d-flex">
      {/* Sidebar */}
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        <Link
          className="sidebar-brand d-flex align-items-center justify-content-center"
          to="/superadmin-dashboard"
        >
          <div className="sidebar-brand-text mx-3">Dashboard</div>
        </Link>

        <hr className="sidebar-divider my-0" />

        <li className="nav-item">
          <Link className="nav-link" to="/superadmin-dashboard">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        <hr className="sidebar-divider" />

        {/* Super Admin Menu */}
        <div className="sidebar-heading">Super Admin</div>

        {/* School Management */}
        <li className={`nav-item ${isSchoolOpen ? "active" : ""}`}>
          <a
            className="nav-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsSchoolOpen(!isSchoolOpen);
            }}
          >
            <i className="fas fa-fw fa-school"></i>
            <span>School Management</span>
            <i
              className={`fas fa-chevron-${isSchoolOpen ? "down" : "right"}`}
            ></i>
          </a>
          {isSchoolOpen && (
            <div className="bg-white py-2 collapse-inner rounded collapse show">
              <Link className="dropdown-item" to="/superadmin/schools">
                Manage Schools
              </Link>
              <Link className="dropdown-item" to="/superadmin/add-school">
                Add New School
              </Link>
            </div>
          )}
        </li>

        {/* User Management - School Admins Only */}
        <li className={`nav-item ${isUsersOpen ? "active" : ""}`}>
          <a
            className="nav-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsUsersOpen(!isUsersOpen);
            }}
          >
            <i className="fas fa-fw fa-users-cog"></i>
            <span>School Admin Management</span>
            <i
              className={`fas fa-chevron-${isUsersOpen ? "down" : "right"}`}
            ></i>
          </a>
          {isUsersOpen && (
            <div className="bg-white py-2 collapse-inner rounded collapse show">
              <Link className="dropdown-item" to="/superadmin/school-admins">
                Manage School Admins
              </Link>
              <Link className="dropdown-item" to="/superadmin/add-school-admin">
                Add New School Admin
              </Link>
            </div>
          )}
        </li>

        {/* Reports & Analytics */}
        <li className={`nav-item ${isReportsOpen ? "active" : ""}`}>
          <a
            className="nav-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsReportsOpen(!isReportsOpen);
            }}
          >
            <i className="fas fa-fw fa-chart-line"></i>
            <span>Reports & Analytics</span>
            <i
              className={`fas fa-chevron-${isReportsOpen ? "down" : "right"}`}
            ></i>
          </a>
          {isReportsOpen && (
            <div className="bg-white py-2 collapse-inner rounded collapse show">
              <Link className="dropdown-item" to="/superadmin/reports">
                View Reports
              </Link>
              <Link className="dropdown-item" to="/superadmin/analytics">
                View Analytics
              </Link>
            </div>
          )}
        </li>

        {/* Announcements */}
        <li className="nav-item">
          <Link className="nav-link" to="/superadmin/announcements">
            <i className="fas fa-fw fa-bullhorn"></i>
            <span>Announcements</span>
          </Link>
        </li>

        {/* Platform Settings */}
        <li className="nav-item">
          <Link className="nav-link" to="/superadmin/settings">
            <i className="fas fa-fw fa-cogs"></i>
            <span>Platform Settings</span>
          </Link>
        </li>

        <hr className="sidebar-divider" />

        {/* Logout */}
        <li className="nav-item">
          <button
            className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
            onClick={handleLogout}
            style={{ padding: "10px", borderRadius: "5px", fontWeight: "bold" }}
          >
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </button>
        </li>

        <hr className="sidebar-divider d-none d-md-block" />
      </ul>

      {/* Content Wrapper */}
      <div id="content-wrapper" className="d-flex flex-column w-100">
        {/* Top Navbar */}
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
          <button
            id="sidebarToggleTop"
            className="btn btn-link d-md-none rounded-circle mr-3"
          >
            <i className="fa fa-bars"></i>
          </button>

          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="notificationsDropdown"
                role="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <i className="fas fa-bell fa-lg"></i>
                {notifications.length > 0 && (
                  <span className="badge badge-danger badge-counter">
                    {notifications.length}
                  </span>
                )}
              </a>
              {isDropdownOpen && (
                <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in show">
                  {notifications.length === 0 ? (
                    <span className="dropdown-item text-muted">
                      No new notifications
                    </span>
                  ) : (
                    notifications.map((note, index) => (
                      <span key={index} className="dropdown-item text-primary">
                        {note}
                      </span>
                    ))
                  )}
                  <div className="dropdown-divider"></div>
                  <Link
                    to="/superadmin/announcements"
                    className="dropdown-item text-center small"
                  >
                    View all announcements
                  </Link>
                </div>
              )}
            </li>

            <li className="nav-item dropdown no-arrow">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
              >
                <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                  {username} - {role}
                </span>
                <i className="fas fa-user-circle fa-lg"></i>
              </a>
            </li>
          </ul>
        </nav>

        {/* Add your page content here */}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
