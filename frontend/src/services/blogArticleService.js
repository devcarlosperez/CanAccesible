import api from "./api";

// Retrieve all blog articles from the backend API
export const getAllBlogArticles = () =>
  api.get("/blogArticles").then((res) => res.data);

// Fetch a specific blog article by its unique ID
export const getBlogArticleById = (id) =>
  api.get(`/blogArticles/${id}`).then((res) => res.data);

// Create a new blog article with an optional image upload
export const createBlogArticle = (articleData, imageFile) => {
  const formData = new FormData();
  formData.append("title", articleData.title);
  formData.append("description", articleData.description);
  formData.append("dateCreation", articleData.dateCreation);
  if (imageFile) formData.append("image", imageFile);

  return api
    .post("/blogArticles", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

// Update an existing blog article's details and image
export const updateBlogArticle = (id, articleData, imageFile) => {
  const formData = new FormData();
  if (articleData.title) formData.append("title", articleData.title);
  if (articleData.description)
    formData.append("description", articleData.description);
  if (articleData.dateCreation)
    formData.append("dateCreation", articleData.dateCreation);
  if (imageFile) formData.append("image", imageFile);

  return api
    .put(`/blogArticles/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

// Remove a blog article permanently by ID
export const deleteBlogArticle = (id) =>
  api.delete(`/blogArticles/${id}`).then((res) => res.data);
