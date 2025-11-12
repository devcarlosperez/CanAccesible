import api from "./api";

export const getAllBlogArticles = () =>
  api.get("/blog-articles").then((res) => res.data);

export const getBlogArticleById = (id) =>
  api.get(`/blog-articles/${id}`).then((res) => res.data);

export const createBlogArticle = (articleData, imageFile) => {
  const formData = new FormData();
  formData.append("title", articleData.title);
  formData.append("description", articleData.description);
  formData.append("dateCreation", articleData.dateCreation);
  if (imageFile) formData.append("image", imageFile);

  return api
    .post("/blog-articles", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

export const updateBlogArticle = (id, articleData, imageFile) => {
  const formData = new FormData();
  if (articleData.title) formData.append("title", articleData.title);
  if (articleData.description)
    formData.append("description", articleData.description);
  if (articleData.dateCreation)
    formData.append("dateCreation", articleData.dateCreation);
  if (imageFile) formData.append("image", imageFile);

  return api
    .put(`/blog-articles/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

export const deleteBlogArticle = (id) =>
  api.delete(`/blog-articles/${id}`).then((res) => res.data);
