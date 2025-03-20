import React from "react";

const TopNavbar: React.FC = () => {
  // Retrieve username and role from localStorage
  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role") || "N/A"; // Role is stored as a string

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      {/* Sidebar Toggle Button for Small Screens */}
      <button
        id="sidebarToggleTop"
        className="btn btn-link d-md-none rounded-circle mr-3"
      >
        <i className="fa fa-bars"></i>
      </button>

      {/* Right Section */}
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown no-arrow">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="userDropdown"
            role="button"
            data-toggle="dropdown"
          >
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">
              {username} - {role} {/* Role is now displayed as a string */}
            </span>
            <i className="fas fa-user-circle fa-lg"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default TopNavbar;
