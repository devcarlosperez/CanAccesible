import { create } from "zustand";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

const getDecodedUser = () => {
  const token = localStorage.getItem("token");
  return token ? jwtDecode(token) : null;
};

const useAuthStore = create((set) => ({
  // Load initial state from localStorage
  user: getDecodedUser(),
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

      localStorage.setItem("token", token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Decodificar el usuario del JWT
      const user = jwtDecode(token);
      console.log("User decodificado del JWT:", user);

      set({
        token,
        user,
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
