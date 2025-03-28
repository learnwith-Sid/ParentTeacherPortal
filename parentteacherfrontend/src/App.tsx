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
import ProtectedRoute from "./components/ProtectedRoute";
import ContactUs from "./pages/ContactUs";
import Announcements from "./pages/admin/Announcements";

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
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/admin-settings" element={<AdminSettings />} />
            <Route path="/user-upload" element={<BulkUserUpload />} />
            <Route path="/register-admin" element={<RegisterAdmin />} />
            <Route path="/announcements" element={<Announcements />} />
          </Route>

          {/* Protected Teacher Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Teacher"]} />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/MarkAttendance" element={<MarkAttendance />} />
            <Route path="/AttendanceHistory" element={<AttendanceHistory />} />
          </Route>

          {/* Protected Parent Routes (if needed in the future) */}
          {/* <Route element={<ProtectedRoute allowedRoles={["Parent"]} />}>
            <Route path="/parent/dashboard" element={<ParentDashboard />} />
          </Route> */}
        </Routes>
      </div>
    </>
  );
};

export default App;
