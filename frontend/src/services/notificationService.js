// Base API URL - uses environment variable with fallback
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:85';
const API_URL = `${API_BASE}/api/notifications`;

export const getNotifications = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error cargando notificaciones");
  }
  return await response.json();
};

export const deleteNotification = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error eliminando notificación");
  }
};