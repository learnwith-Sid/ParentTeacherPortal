import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthRedirect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Allow unauthenticated users to stay on specific public pages
    const publicPages = ["/", "/contact-us"];
    const isPublicPage = publicPages.includes(window.location.pathname);

    if (!token && !isPublicPage) {
      navigate("/login", { replace: true });
    }
  }, [navigate]); // ✅ Remove `location` to avoid unnecessary re-renders

  return null;
};

export default AuthRedirect;
