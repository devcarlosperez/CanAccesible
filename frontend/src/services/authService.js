import { create } from "zustand";
import api from "../services/api";
import { getUserById } from "../services/userService";

const useAuthStore = create((set) => ({
  // Load initial state from localStorage
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,

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
      const loggedUser = res.data.user;

      localStorage.setItem("token", token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const fullUser = await getUserById(loggedUser.id);
      localStorage.setItem("user", JSON.stringify(fullUser));

      set({
        token,
        user: fullUser,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Login failed",
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
      console.error("Backend logout error:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Remove Authorization header
    delete api.defaults.headers.common["Authorization"];

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
