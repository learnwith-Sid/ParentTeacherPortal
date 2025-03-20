import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSidebar";
import TopNavbar from "../../components/AdminTopNavbar";
import EditUserModal from "./EditUserModal";
import $ from "jquery";
import "datatables.net/js/dataTables.js";
import "datatables.net";
import "datatables.net-responsive";

interface User {
  id: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
}

const ManageUsers: React.FC = React.memo(() => {
  console.log("Rendering Dashboard...");

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log("Fetching users...");
      const response = await fetch(
        "http://localhost:5029/api/usermanagement/users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      console.log("Fetched Users:", data);
      setUsers(data);
    } catch (error: any) {
      setError("Error fetching users");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `http://localhost:5029/api/usermanagement/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers(users.filter((user) => user.id !== id));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete user");
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (updatedUser: {
    id: string;
    userName: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: string;
  }) => {
    try {
      const response = await fetch(
        `http://localhost:5029/api/usermanagement/update/${updatedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // Update user list in UI
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );

      alert("User updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update user");
    }
  };

  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopNavbar />
          <div className="container-fluid mt-4">
            <h2>Admin Panel</h2>
            {loading ? (
              <p>Loading users...</p>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <table id="userTable" className="table table-striped mt-3">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.userName}</td>
                      <td>{user.firstName || ""}</td>
                      <td>{user.lastName || ""}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm mr-2"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
});

export default ManageUsers;
