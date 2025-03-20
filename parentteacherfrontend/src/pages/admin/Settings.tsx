import React, { useState, useEffect } from "react";
import Sidebar from "../../components/AdminSidebar";
import TopNavbar from "../../components/AdminTopNavbar";

const AdminSettings = () => {
  const [platformName, setPlatformName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    fetch("http://localhost:5029/api/settings/settings")
      .then((response) => response.json())
      .then((data) => {
        setPlatformName(data.platformName);
        if (data.logoUrl) {
          const apiBaseUrl = "http://localhost:5029"; // Replace with actual backend API URL if needed
          setLogoUrl(
            data.logoUrl.startsWith("http")
              ? data.logoUrl
              : `${apiBaseUrl}${data.logoUrl}`
          );
        }
      })
      .catch((error) => console.error("Error fetching settings:", error));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    let uploadedLogoUrl = logoUrl;

    if (logoFile) {
      const formData = new FormData();
      formData.append("logo", logoFile);

      try {
        const uploadResponse = await fetch(
          "http://localhost:5029/api/settings/upload-logo",
          {
            method: "POST",
            body: formData,
          }
        );
        const uploadData = await uploadResponse.json();
        uploadedLogoUrl = uploadData.logoUrl;
      } catch (error) {
        console.error("Error uploading logo:", error);
        return;
      }
    }

    fetch("http://localhost:5029/api/settings/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platformName, logoUrl: uploadedLogoUrl }),
    })
      .then((response) => response.json())
      .then(() => alert("Settings updated successfully!"))
      .catch((error) => console.error("Error updating settings:", error));
  };

  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopNavbar />
          <div className="container-fluid mt-4">
            <h2>Settings</h2>
            <div className="form-group">
              <label>Platform Name</label>
              <input
                type="text"
                className="form-control"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Upload Logo</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
              {logoUrl && (
                <img src={logoUrl} alt="Logo" className="mt-2" width={100} />
              )}
            </div>
            <button className="btn btn-primary" onClick={handleSave}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
