import api from "./api";

export const getAllNotifications = () =>
  api.get("/notifications").then((res) => res.data);

export const createNotification = (notificationData) =>
  api.post("/notifications", notificationData, {}).then((res) => res.data);

export const deleteNotification = (id) =>
  api.delete(`/notifications/${id}`).then((res) => res.data);
