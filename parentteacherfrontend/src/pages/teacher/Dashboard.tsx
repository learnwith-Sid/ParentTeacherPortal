import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar";
import TopNavbar from "../../components/AdminTopNavbar";
import { useNavigate } from "react-router-dom";

const TeacherDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    console.log(role);
    if (role !== "Teacher") {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopNavbar />
          <div className="container-fluid mt-4">
            <h2>Teacher Dashboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
              <div className="col-md-4">
                <div className="card p-3">
                  <h5>Assignments</h5>
                  <p>Status: Coming Soon</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3">
                  <h5>Attendance</h5>
                  <p>Status: Coming Soon</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3">
                  <h5>Student Management</h5>
                  <p>Status: Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
