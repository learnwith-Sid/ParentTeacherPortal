import axios from "axios";

// API Base URL
const API_BASE_URL = "http://localhost:5029/api"; // Update with your actual API URL

// Function to fetch all users
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};

// Function to delete a user
export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user", error);
    throw error;
  }
};

// Function to register a user
export const registerUser = async (user: { name: string; email: string; role: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, user, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to register user", error);
    throw error;
  }
};

// Function to fetch assignments
export const getAssignments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/assignments`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch assignments", error);
    throw error;
  }
};

// Function to register an admin
export const registerAdmin = async (adminData: {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Auth/register-admin`, adminData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Registration failed", error);
    throw error;
  }
};

// Function to login a user
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Auth/login`, {
      username,
      password,
    }, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

// Function to get all schools with their admins
export const getSchoolsWithAdmins = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/SuperAdmin/schools-with-users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching schools with admins", error);
    throw error;
  }
};

// Function to add a school admin
export const addSchoolAdmin = async (adminData: {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  schoolId: number;
  schoolCode:string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/SuperAdmin/add-school-admin`, adminData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding school admin", error);
    throw error;
  }
};

// Function to remove a school admin
export const removeSchoolAdmin = async (userId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/SuperAdmin/remove-school-admin/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing school admin", error);
    throw error;
  }
};

// Function to get the admins of a specific school by school ID
export const getSchoolAdmins = async (schoolCode: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/SuperAdmin/school-admins/${schoolCode}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching school admins", error);
    throw error;
  }
};
