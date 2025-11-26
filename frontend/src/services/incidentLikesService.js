import api from "./api";

export const getAllIncidentLikes = () => api.get("/incidentLikes").then((res) => res.data);

export const getIncidentLikeById = (id) =>
  api.get(`/incidentLikes/${id}`).then((res) => res.data);

export const getIncidentLikeByIncidentAndUserId = async (incidentId, userId) => {
  try {
    const response = await api.get(`/incidentLikes/incident/${incidentId}/user/${userId}`);
    return response.data; // Return the like if it exists
  } catch (err) {
    // If there's no like, return null
    if (err.response && err.response.status === 404) {
      return null;
    }
    throw err;
  }
};

export const createIncidentLike = (incidentLikeData) =>
  api.post("/incidentLikes", incidentLikeData, {}).then((res) => res.data);

export const updateIncidentLike = (id, incidentLikeData) =>
  api.put(`/incidentLikes/${id}`, incidentLikeData, {}).then((res) => res.data);

export const deleteIncidentLike = (id) => api.delete(`/incidentLikes/${id}`).then((res) => res.data);
