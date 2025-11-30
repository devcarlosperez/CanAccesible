import api from "./api";

export const getAllUsers = () => api.get("/users").then((res) => res.data);

export const getUserById = (id) =>
  api.get(`/users/${id}`).then((res) => res.data);

export const createUser = (userData) =>
  api
    .post("/users", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

export const deleteUser = (id) => api.delete(`/users/${id}`);

export const updateUser = (id, userData) =>
  api
    .put(`/users/${id}`, userData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
