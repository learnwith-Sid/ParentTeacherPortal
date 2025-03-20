import React, { useState } from "react";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:5029/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
        return;
      }

      // Store token, username, and roles
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.roles); // ✅ Store it as a string

      console.log(localStorage.getItem("roles"));
      setSuccess(true); // ✅ Show success message instead of redirecting
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <section className="page-section" id="">
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
              {/* Username input */}
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label htmlFor="username">Username</label>
                <div className="invalid-feedback">Username is required.</div>
              </div>

              {/* Email input */}
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email">Email</label>
                <div className="invalid-feedback">
                  A valid email is required.
                </div>
              </div>

              {/* Password input */}
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password">Password</label>
                <div className="invalid-feedback">Password is required.</div>
              </div>

              {/* Error & Success Messages */}
              {error && (
                <div className="text-danger text-center mb-3">{error}</div>
              )}
              {success && (
                <div className="text-success text-center mb-3">
                  Login successful! You can now access the dashboard.
                </div>
              )}

              {/* Submit Button */}
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
