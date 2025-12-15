import api from "./api";

export const getAllIncidents = () =>
  api.get("/incidents").then((res) => res.data);

export const getMyIncidents = () =>
  api.get("/incidents/my-incidents").then((res) => res.data);

export const getIncidentById = (id) =>
  api.get(`/incidents/${id}`).then((res) => res.data);

export const createIncident = (incidentData) =>
  api
    .post("/incidents", incidentData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

export const updateIncident = (id, incidentData) =>
  api
    .put(`/incidents/${id}`, incidentData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

export const deleteIncident = (id) =>
  api.delete(`/incidents/${id}`).then((res) => res.data);
