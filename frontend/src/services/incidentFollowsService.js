import api from "./api";

export const getAllIncidentFollows = () =>
  api.get("/incidentFollows").then((res) => res.data);

export const getIncidentFollowById = (id) =>
  api.get(`/incidentFollows/${id}`).then((res) => res.data);

export const getIncidentFollowsByIncidentId = (incidentId) =>
  api.get(`/incidentFollows/incident/${incidentId}`).then((res) => res.data);

export const getIncidentFollowByIncidentAndUserId = async (
  incidentId,
  userId
) => {
  try {
    const response = await api.get(
      `/incidentFollows/incident/${incidentId}/user/${userId}`
    );
    return response.data; // Return the follow if it exists
  } catch (err) {
    // If there's no follow, return null
    if (err.response && err.response.status === 404) {
      return null;
    }
    throw err;
  }
};

export const createIncidentFollow = (incidentFollowData) =>
  api.post("/incidentFollows", incidentFollowData, {}).then((res) => res.data);

export const updateIncidentFollow = (id, incidentFollowData) =>
  api
    .put(`/incidentFollows/${id}`, incidentFollowData, {})
    .then((res) => res.data);

export const deleteIncidentFollow = (id) =>
  api.delete(`/incidentFollows/${id}`).then((res) => res.data);
