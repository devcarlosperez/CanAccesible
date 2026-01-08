import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllBlogArticles,
  getBlogArticleById,
  createBlogArticle,
  updateBlogArticle,
  deleteBlogArticle,
} from "../../services/blogArticleService";
import api from "../../services/api";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Unit Test: blogArticleService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllBlogArticles", () => {
    it("should fetch all blog articles successfully", async () => {
      // Mock API response with sample articles
      const mockArticles = [
        { id: 1, title: "Article 1" },
        { id: 2, title: "Article 2" },
      ];
      api.get.mockResolvedValue({ data: mockArticles });

      const result = await getAllBlogArticles();

      // Verify the API is called correctly and returns data
      expect(api.get).toHaveBeenCalledWith("/blogArticles");
      expect(result).toEqual(mockArticles);
    });

    it("should handle network errors when fetching articles", async () => {
      // Simulate a network error and verify it throws
      api.get.mockRejectedValue(new Error("Network Error"));

      await expect(getAllBlogArticles()).rejects.toThrow("Network Error");
    });
  });

  describe("createBlogArticle", () => {
    it("should create a blog article with FormData including image", async () => {
      // Prepare article data and mock image file
      const articleData = {
        title: "New Article",
        description: "Description",
        dateCreation: "2023-01-01",
      };
      const imageFile = new File(["dummy"], "test.png", { type: "image/png" });
      const mockResponse = { id: 1, ...articleData };
      api.post.mockResolvedValue({ data: mockResponse });

      const result = await createBlogArticle(articleData, imageFile);

      // Call the service and verify FormData headers
      expect(api.post).toHaveBeenCalledWith(
        "/blogArticles",
        expect.any(FormData),
        expect.objectContaining({
          headers: { "Content-Type": "multipart/form-data" },
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle 401 Unauthorized error", async () => {
      // Simulate 401 error response from API
      const error = new Error("Unauthorized");
      error.response = { status: 401 };
      api.post.mockRejectedValue(error);

      await expect(createBlogArticle({}, null)).rejects.toThrow("Unauthorized");
    });

    it("should handle 500 Server error", async () => {
      // Simulate 500 server error response
      const error = new Error("Internal Server Error");
      error.response = { status: 500 };
      api.post.mockRejectedValue(error);

      await expect(createBlogArticle({}, null)).rejects.toThrow(
        "Internal Server Error"
      );
    });
  });

  describe("updateBlogArticle", () => {
    it("should update a blog article with FormData", async () => {
      // Mock successful update response
      const updateData = { title: "Updated Title" };
      const mockResponse = { id: 1, ...updateData };
      api.put.mockResolvedValue({ data: mockResponse });

      const result = await updateBlogArticle(1, updateData, null);

      // Check if PUT request receives correct FormData
      expect(api.put).toHaveBeenCalledWith(
        "/blogArticles/1",
        expect.any(FormData),
        expect.objectContaining({
          headers: { "Content-Type": "multipart/form-data" },
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("deleteBlogArticle", () => {
    it("should delete a blog article by id", async () => {
      // Mock successful delete response
      api.delete.mockResolvedValue({ data: { success: true } });

      const result = await deleteBlogArticle(1);

      // Ensure delete API endpoint is called with correct ID
      expect(api.delete).toHaveBeenCalledWith("/blogArticles/1");
      expect(result).toEqual({ success: true });
    });
  });
});
