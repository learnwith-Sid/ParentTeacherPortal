import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const Notifications = () => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5029/chatHub") // Update with your API URL
      .withAutomaticReconnect()
      .build();

    connection.start().catch((err) => console.error("Connection failed:", err));

    connection.on("ReceiveNotification", (message: string) => {
      setNotifications((prev) => [message, ...prev]);
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div className="notification-container">
      {notifications.length > 0 &&
        notifications.map((msg, index) => (
          <div key={index} className="notification-item">
            📢 {msg}
          </div>
        ))}
    </div>
  );
};

export default Notifications;
