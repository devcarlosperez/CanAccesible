import { create } from "zustand";
import api from "../services/api";
import { getUserById } from "../services/userService";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/signin", { email, password }, {
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
        error: err.response?.data?.message || "Error al iniciar sesión",
        loading: false,
      });
    }
  },

  logout: async () => {
    try {
      // ✅ Llama al backend para destruir la sesión
      await api.post("/auth/logout", {}, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Error al desconectar del backend:", err);
    }

    // Limpia localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete api.defaults.headers.common["Authorization"];

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
