import React, { createContext, useContext, useState } from "react";

// ─── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  // Initialise from localStorage so the user stays logged in on refresh
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Called after a successful login or register API response
  const login = (userData) => {
    // userData = { token, username, userId, isAdmin }
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth() {
  return useContext(AuthContext);
}
