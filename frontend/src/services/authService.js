import { create } from "zustand";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const expirationTime = decoded.exp * 1000;
    return Date.now() >= expirationTime;
  } catch (err) {
    return true;
  }
};

const initializeToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    return null;
  }

  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return token;
};

const initialToken = initializeToken();

const useAuthStore = create((set) => ({
  // Load initial state from localStorage
  user: null,
  token: initialToken,
  isAuthenticated: !!initialToken,
  isAdmin: false,
  loading: false,
  error: null,

  // Update user in store manually
  setUser: (userData) => {
    set((state) => ({
      user: { ...state.user, ...userData },
      isAdmin: userData.role === "admin",
    }));
  },

  // Fetch fresh user data from backend
  fetchCurrentUser: async () => {
    const state = useAuthStore.getState();
    if (!state.token) return;

    try {
      const res = await api.get("/auth/me");
      set((state) => ({
        user: { ...state.user, ...res.data },
        isAdmin: res.data.role === "admin",
      }));
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      // If unauthorized, clear session
      if (err.response && err.response.status === 401) {
        state.logout();
      }
    }
  },

  // Login function (Basic Auth + JWT + Session)
  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const base64Credentials = btoa(`${email}:${password}`);

      const res = await api.post("/auth/signin", "", {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
          "Content-Type": "text/plain",
        },
        withCredentials: true,
      });

      const token = res.data.token;
      const userData = res.data.user;

      if (isTokenExpired(token)) {
        return set({
          error: "error_token_expired",
          loading: false,
        });
      }

      localStorage.setItem("token", token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      set({
        token,
        user: userData,
        isAuthenticated: true,
        isAdmin: userData.role === "admin",
        loading: false,
      });
    } catch (err) {
      const msg = err.response?.data?.message;
      const errorMap = {
        "User not found": "error_user_not_found",
        "Invalid password": "error_invalid_password",
      };

      set({
        error: errorMap[msg] || "error_login_failed",
        loading: false,
      });
    }
  },

  // Logout function (clear session + client data)
  logout: async () => {
    try {
      await api.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      // Silently fail backend logout
    }

    localStorage.removeItem("token");

    // Remove Authorization header
    delete api.defaults.headers.common["Authorization"];

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
    });

    window.location.reload();
  },
}));

export default useAuthStore;
