import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar";
import TopNavbar from "../../components/AdminTopNavbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface User {
  userName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
}

const Dashboard: React.FC = React.memo(() => {
  console.log("Rendering Dashboard...");

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");

        const response = await fetch(
          "http://localhost:5029/api/usermanagement/users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal,
          }
        );

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        console.log("Fetched Users:", data);

        setUsers(data);
      } catch (error: any) {
        if (error instanceof DOMException && error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setError("Error fetching users");
          console.error("Fetch error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, []);

  const roleData = [
    { name: "Admins", value: users.filter((u) => u.role === "Admin").length },
    {
      name: "Teachers",
      value: users.filter((u) => u.role === "Teacher").length,
    },
    { name: "Parents", value: users.filter((u) => u.role === "Parent").length },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopNavbar />
          <div className="container-fluid mt-4">
            <h2>Admin Dashboard</h2>
            {loading ? (
              <p>Loading users...</p>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card p-3">
                    <h5>User Distribution</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={roleData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                          {roleData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card p-3">
                    <h5>Users by Role</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={roleData}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Dashboard;
