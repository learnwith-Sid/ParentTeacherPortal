// api.ts - API Service
const API_BASE_URL = "http://localhost:5029/api"; // Update with your actual API URL

export const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);
  return response.json();
};

export const deleteUser = async (id: string) => {
  await fetch(`${API_BASE_URL}/users/${id}`, { method: "DELETE" });
};

export const registerUser = async (user: { name: string; email: string; role: string }) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Failed to register user");
  }

  return response.json();
};
export const getAssignments = async () => {
    const response = await fetch(`${API_BASE_URL}/assignments`);
    if (!response.ok) {
      throw new Error("Failed to fetch assignments");
    }
    return response.json();
  };
  export const registerAdmin = async (adminData: { username: string; firstName: string; lastName: string; email: string; password: string; role: string; }) => {
    const response = await fetch(`${API_BASE_URL}/Auth/register-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });
  
    if (!response.ok) {
      throw new Error("Registration failed");
    }
  
    return await response.json();
  };
  export const loginUser = async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }), // API expects 'username' instead of 'email'
    });
  
    if (!response.ok) {
      throw new Error("Login failed");
    }
  
    return await response.json();
  };