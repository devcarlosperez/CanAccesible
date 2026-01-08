import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllBlogArticles, getBlogArticleById, createBlogArticle, updateBlogArticle, deleteBlogArticle } from "../../services/blogArticleService";
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
            // Arrange
            const mockArticles = [
                { id: 1, title: "Article 1" },
                { id: 2, title: "Article 2" }
            ];
            api.get.mockResolvedValue({ data: mockArticles });

            // Act
            const result = await getAllBlogArticles();

            // Assert
            expect(api.get).toHaveBeenCalledWith("/blogArticles");
            expect(result).toEqual(mockArticles);
        });

        it("should handle network errors when fetching articles", async () => {
            // Arrange
            api.get.mockRejectedValue(new Error("Network Error"));

            // Act & Assert
            await expect(getAllBlogArticles()).rejects.toThrow("Network Error");
        });
    });

    describe("createBlogArticle", () => {
        it("should create a blog article with FormData including image", async () => {
            // Arrange
            const articleData = {
                title: "New Article",
                description: "Description",
                dateCreation: "2023-01-01"
            };
            const imageFile = new File(["dummy"], "test.png", { type: "image/png" });
            const mockResponse = { id: 1, ...articleData };
            api.post.mockResolvedValue({ data: mockResponse });

            // Act
            const result = await createBlogArticle(articleData, imageFile);

            // Assert
            expect(api.post).toHaveBeenCalledWith(
                "/blogArticles",
                expect.any(FormData),
                expect.objectContaining({
                    headers: { "Content-Type": "multipart/form-data" }
                })
            );
            expect(result).toEqual(mockResponse);
        });

        it("should handle 401 Unauthorized error", async () => {
            // Arrange
            const error = new Error("Unauthorized");
            error.response = { status: 401 };
            api.post.mockRejectedValue(error);

            // Act & Assert
            await expect(createBlogArticle({}, null)).rejects.toThrow("Unauthorized");
        });

        it("should handle 500 Server error", async () => {
            // Arrange
            const error = new Error("Internal Server Error");
            error.response = { status: 500 };
            api.post.mockRejectedValue(error);

            // Act & Assert
            await expect(createBlogArticle({}, null)).rejects.toThrow("Internal Server Error");
        });
    });

    describe("deleteBlogArticle", () => {
        it("should delete a blog article by id", async () => {
            // Arrange
            api.delete.mockResolvedValue({ data: { success: true } });

            // Act
            const result = await deleteBlogArticle(1);

            // Assert
            expect(api.delete).toHaveBeenCalledWith("/blogArticles/1");
            expect(result).toEqual({ success: true });
        });
    });
});
