import React, { createContext, useState, useEffect, useContext } from "react";

// Define the structure of the authentication context
interface AuthContextType {
  user: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// Create AuthContext with an initial empty object, cast correctly
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    setUser(localStorage.getItem("token"));
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setUser(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Use a custom hook to ensure AuthContext is properly used
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
