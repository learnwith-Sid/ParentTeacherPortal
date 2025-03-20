import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/creative/css/creative.min.css"; // Load Creative theme CSS
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
