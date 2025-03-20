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
import BulkUserUpload from "./pages/admin/BulkUserUpload";

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Define where the navbar should be visible
  const publicRoutes = ["/", "/login", "/contact-us"];
  const showNavbar = publicRoutes.includes(location.pathname);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ Redirect unauthenticated users (except on public routes)
    if (!token && !publicRoutes.includes(location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <>
      {showNavbar && <PublicNavbar />} {/* ✅ Navbar only on public pages */}
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
          <Route path="/user-upload" element={<BulkUserUpload />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
