import api from "./api";

export const createIncidentComment = (commentData) =>
  api.post("/incident-comments", commentData).then((res) => res.data);

export const getCommentsByIncident = (incidentId) =>
  api.get(`/incident-comments/incident/${incidentId}`).then((res) => res.data);

export const getCommentById = (id) =>
  api.get(`/incident-comments/${id}`).then((res) => res.data);

export const updateIncidentComment = (id, commentData) =>
  api.put(`/incident-comments/${id}`, commentData).then((res) => res.data);

export const deleteIncidentComment = (id) =>
  api.delete(`/incident-comments/${id}`).then((res) => res.data);
