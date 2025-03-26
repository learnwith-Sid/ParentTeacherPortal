import axios from "axios";

const API_URL = "http://localhost:5029/api/Announcements";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const getAnnouncements = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const createAnnouncement = async (announcement: FormData) => {
 
  


  const response = await axios.post(API_URL, announcement, {
    headers: getAuthHeaders(), 
  });
  

  return response.data;
};


export const updateAnnouncement = async (id: number, announcement: FormData) => {
  

  await axios.put(`${API_URL}/${id}`, announcement, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
};

export const deleteAnnouncement = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};
