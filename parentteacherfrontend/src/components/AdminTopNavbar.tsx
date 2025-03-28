import React, { useEffect, useState } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { Link } from "react-router-dom";

const TopNavbar: React.FC = () => {
  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role") || "N/A";

  const [notifications, setNotifications] = useState<string[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (role === "N/A") return;

    const newConnection = new HubConnectionBuilder()
      .withUrl(`http://localhost:5029/chatHub?role=${role}`)
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR Hub");

        newConnection.on(
          "ReceiveNotification",
          (message: string, targetRole: string) => {
            console.log(
              "🔔 Received Notification:",
              message,
              "Target Role:",
              targetRole
            );
            if (targetRole === "All" || targetRole === role) {
              setNotifications((prev) => [...prev, message]);
            }
          }
        );
      })
      .catch((err) => console.error("SignalR connection error: ", err));

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, [role]);

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <button
        id="sidebarToggleTop"
        className="btn btn-link d-md-none rounded-circle mr-3"
      >
        <i className="fa fa-bars"></i>
      </button>

      <ul className="navbar-nav ml-auto">
        {/* Notification Bell */}
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="notificationsDropdown"
            role="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <i className="fas fa-bell fa-lg"></i>
            {notifications.length > 0 && (
              <span className="badge badge-danger badge-counter">
                {notifications.length}
              </span>
            )}
          </a>
          {isDropdownOpen && (
            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in show">
              {notifications.length === 0 ? (
                <span className="dropdown-item text-muted">
                  No new notifications
                </span>
              ) : (
                notifications.map((notification, index) => (
                  <span key={index} className="dropdown-item text-primary">
                    {notification}
                  </span>
                ))
              )}
              <div className="dropdown-divider"></div>
              <Link
                to="/announcements"
                className="dropdown-item text-center small"
              >
                View all announcements
              </Link>
            </div>
          )}
        </li>

        {/* User Profile */}
        <li className="nav-item dropdown no-arrow">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="userDropdown"
            role="button"
          >
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">
              {username} - {role}
            </span>
            <i className="fas fa-user-circle fa-lg"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default TopNavbar;
