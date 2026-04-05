import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

/* ─── Mock users stored in localStorage (replace with real API later) ─── */
const STORAGE_KEY = "hemolife_auth";
const USERS_KEY   = "hemolife_users";

const DEFAULT_ADMIN = {
  id: "admin-001",
  name: "Admin User",
  email: "admin@hemolife.com",
  password: "admin123",
  role: "admin",
  bloodType: "O+",
  phone: "+91 98765 00000",
  location: "Silchar, Assam",
  joinedDate: "Jan 1, 2024",
  donations: 0,
};

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  /* Seed default admin if no users exist yet */
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (!users.length) {
      localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
    }
    /* Restore session */
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  /* ── Login ── */
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: "Invalid email or password." };
    const { password: _, ...safe } = found;
    setUser(safe);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    return { success: true };
  };

  /* ── Register ── */
  const register = (data) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser = {
      id: `user-${Date.now()}`,
      ...data,
      role: "donor",
      donations: 0,
      joinedDate: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password: _, ...safe } = newUser;
    setUser(safe);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    return { success: true };
  };

  /* ── Logout ── */
  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
