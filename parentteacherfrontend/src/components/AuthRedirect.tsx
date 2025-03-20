import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthRedirect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // ✅ Get role from localStorage

    // Allow unauthenticated users to stay on specific public pages
    const publicPages = ["/", "/login", "/contact-us"];
    const isPublicPage = publicPages.includes(location.pathname);

    if (!token && !isPublicPage) {
      navigate("/login", { replace: true });
      return;
    }

    // ✅ Redirect based on role after login
    if (token) {
      if (location.pathname === "/login") {
        if (role === "Admin") navigate("/dashboard", { replace: true });
        else if (role === "Teacher")
          navigate("/teacher/dashboard", { replace: true });
        else if (role === "Parent")
          navigate("/parent/dashboard", { replace: true });
      }
    }
  }, [navigate, location.pathname]); // ✅ Depend on `location.pathname` to track page changes

  return null;
};

export default AuthRedirect;
