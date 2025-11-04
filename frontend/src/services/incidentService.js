import api from "./api";

export const getAllIncidents = () => api.get("/incidents").then((res) => res.data);

export const getIncidentById = (id) =>
  api.get(`/incidents/${id}`).then((res) => res.data);

export const createIncident = (incidentData) =>
  api.post("/incidents", incidentData).then((res) => res.data);

export const updateIncident = (id, incidentData) =>
  api.put(`/incidents/${id}`, incidentData).then((res) => res.data);

export const deleteIncident = (id) => api.delete(`/incidents/${id}`).then((res) => res.data);