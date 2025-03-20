import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Use for navigation

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:5029/api/auth/login",
        credentials
      );

      // Store token, username, and role
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.roles[0]); // Store only the first role as a string

      console.log("Role:", data.roles[0]); // Debugging purpose

      // ✅ Redirect based on role
      if (data.roles.includes("Admin")) {
        navigate("/dashboard");
      } else if (data.roles.includes("Teacher")) {
        navigate("/teacher/dashboard");
      } else if (data.roles.includes("Parent")) {
        navigate("/parent/dashboard");
      } else {
        navigate("/student/dashboard"); // Default for students
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <section className="page-section">
      <div className="container px-4 px-lg-5 mt-5">
        <div className="row gx-4 gx-lg-5 justify-content-center">
          <div className="col-lg-8 col-xl-6 text-center text-white">
            <h2 className="mt-0">Login</h2>
            <hr className="divider" />
            <p className="text-white-75 mb-4">
              Enter your credentials to access your account.
            </p>
          </div>
        </div>

        <div className="row gx-4 gx-lg-5 justify-content-center">
          <div className="col-lg-6">
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                />
                <label>Username</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
                <label>Email</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
                <label>Password</label>
              </div>

              {error && (
                <div className="text-danger text-center mb-3">{error}</div>
              )}

              <div className="d-grid">
                <button className="btn btn-primary btn-xl" type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
