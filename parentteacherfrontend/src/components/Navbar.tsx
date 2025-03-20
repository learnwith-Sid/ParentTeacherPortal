import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top py-3">
      <div className="container px-4 px-lg-5">
        <Link className="navbar-brand" to="/">
          Home
        </Link>
        <button
          className="navbar-toggler navbar-toggler-right"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto my-2 my-lg-0">
            {role === "Admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/Dashboard">
                  Admin Panel
                </Link>
              </li>
            )}
            {role === "Teacher" && (
              <li className="nav-item">
                <Link className="nav-link" to="/Dashboard">
                  Teacher Panel
                </Link>
              </li>
            )}
            {role === "Parent" && (
              <li className="nav-item">
                <Link className="nav-link" to="/Dashboard">
                  Parent Panel
                </Link>
              </li>
            )}
            {role === "Student" && (
              <li className="nav-item">
                <Link className="nav-link" to="/studentpanel">
                  Student Panel
                </Link>
              </li>
            )}
          </ul>
          {!token ? (
            <Link className="btn btn-outline-light me-2" to="/login">
              Login
            </Link>
          ) : (
            <>
              <Link className="btn btn-outline-light me-2" to="/register-admin">
                Register
              </Link>
              <button className="btn btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
