import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import Home from "./pages/home/Home";
import PublicNavbar from "./components/PublicNavbar";
import ManageUsers from "./pages/admin/ManageUsers";
import RegisterAdmin from "./pages/auth/RegisterAdmin";
import TeacherDashboard from "./pages/teacher/Dashboard";
import MarkAttendance from "./pages/teacher/MarkAttendance";
import AttendanceHistory from "./pages/teacher/AttendanceHistory";
import AdminSettings from "./pages/admin/Settings";

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Rendering App...");
    console.log("Current route:", location.pathname);

    const token = localStorage.getItem("token");

    if (
      !token &&
      location.pathname !== "/" &&
      location.pathname !== "/contact-us" &&
      location.pathname !== "/login"
    ) {
      navigate("/login", { replace: true });
    }
  }, [location.pathname, navigate]); // ✅ Added `navigate` to dependencies

  return (
    <>
      <PublicNavbar />
      <div className="masthead">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/MarkAttendance" element={<MarkAttendance />} />
          <Route path="/AttendanceHistory" element={<AttendanceHistory />} />
          <Route path="/admin-settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
