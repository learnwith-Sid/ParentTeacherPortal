import React, { useEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/AdminSidebar";
import TopNavbar from "../../components/AdminTopNavbar";

interface Announcement {
  id: number;
  title: string;
  message: string;
  createdAt: string;
}

const StudentDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "Student") {
      navigate("/login");
    } else {
      fetchAnnouncements(role);
      setLoading(false);
    }
  }, [navigate]);

  const fetchAnnouncements = async (role: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5029/api/announcements/by-role?role=${role}`
      ); // 🔹 Adjust API endpoint
      setAnnouncements(response.data);
    } catch (err) {
      setError("Failed to load announcements");
    }
  };

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
            <h2>Student Dashboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* 🔔 Recent Announcements */}
            <div className="card shadow mb-4">
              <div className="card-header">
                <h5 className="m-0 font-weight-bold text-primary">
                  📢 Recent Announcements
                </h5>
              </div>
              <div className="card-body">
                {announcements.length === 0 ? (
                  <p>No recent announcements</p>
                ) : (
                  <ul className="list-group">
                    {announcements.slice(0, 5).map((announcement) => (
                      <li key={announcement.id} className="list-group-item">
                        <strong>{announcement.title}</strong> -{" "}
                        {new Date(announcement.createdAt).toLocaleDateString()}
                        <p className="mb-1">
                          {announcement.message.substring(0, 50)}...
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="text-right mt-2">
                  <Link
                    to="/student/announcements"
                    className="btn btn-sm btn-primary"
                  >
                    View All Announcements
                  </Link>
                </div>
              </div>
            </div>

            {/* Other Dashboard Features */}
            <div className="row">
              <div className="col-md-4">
                <div className="card p-3">
                  <h5>📑 Assignments</h5>
                  <p>View & Submit Assignments</p>
                  <p>Status: Coming Soon</p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card p-3">
                  <h5>📋 Attendance</h5>
                  <p>Check Daily & Monthly Attendance</p>
                  <p>Status: Coming Soon</p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card p-3">
                  <h5>📊 Performance Reports</h5>
                  <p>View Exam Scores & Report Cards</p>
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

export default StudentDashboard;
