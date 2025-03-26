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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await new Promise((resolve) => setTimeout(resolve, 100)); // 🔥 Small delay to ensure state updates

    const formData = new FormData();
    formData.append("Title", form.title.trim() || "");
    formData.append("Message", form.message.trim() || "");
    formData.append("TargetAudience", form.targetAudience.trim() || "");

    console.log(
      "📌 FormData Before Sending:",
      Object.fromEntries(formData.entries())
    );
    if (editingId) {
      await updateAnnouncement(editingId, formData);
    } else {
      await createAnnouncement(formData);
    }
    loadAnnouncements();
  };

  const handleEdit = (announcement: any) => {
    setForm({
      title: announcement.title,
      message: announcement.message,
      targetAudience: announcement.targetAudience,
    });
    setEditingId(announcement.id);
    loadAnnouncements();
  };

  const handleDelete = async (id: number) => {
    await deleteAnnouncement(id);
    loadAnnouncements();
  };

  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopNavbar />
          <div className="container-fluid mt-4">
            <h2 className="mb-4">Manage Announcements</h2>

            {/* Announcement Form */}
            <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter announcement title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  placeholder="Enter announcement message"
                  value={form.message}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Target Audience</label>
                <select
                  className="form-select"
                  value={form.targetAudience}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      targetAudience: e.target.value,
                    }))
                  }
                >
                  <option value="All">All</option>
                  <option value="Teachers">Teachers</option>
                  <option value="Parents">Parents</option>
                  <option value="Students">Students</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Attachment (Optional)</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    setFile(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>

              <button type="submit" className="btn btn-primary">
                {editingId ? "Update" : "Create"} Announcement
              </button>
            </form>

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
                          <td>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEdit(announcement)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(announcement.id)}
                            >
                              Delete
                            </button>
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
