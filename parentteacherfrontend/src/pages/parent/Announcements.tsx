import React, { useEffect, useState } from "react";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../services/announcementService";
import Sidebar from "../../components/AdminSidebar";
import TopNavbar from "../../components/AdminTopNavbar";

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
    targetAudience: "All",
  });
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    const data = await getAnnouncements();
    setAnnouncements(data);
  };

  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopNavbar />
          <div className="container-fluid mt-4">
            <h2 className="mb-4">Manage Announcements</h2>
            {/* Announcements List */}
            <div className="card p-4 shadow-sm">
              <h5 className="mb-3">Announcements List</h5>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>Title</th>
                      <th>Message</th>
                      <th>Audience</th>
                      <th>Attachment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center">
                          No announcements found.
                        </td>
                      </tr>
                    ) : (
                      announcements.map((announcement) => (
                        <tr key={announcement.id}>
                          <td>{announcement.title}</td>
                          <td>{announcement.message}</td>
                          <td>{announcement.targetAudience}</td>
                          <td>
                            {announcement.attachmentUrl ? (
                              <a
                                href={announcement.attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View
                              </a>
                            ) : (
                              "No Attachment"
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
