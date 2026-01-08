import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllBlogArticles, getBlogArticleById, createBlogArticle, updateBlogArticle, deleteBlogArticle } from "../../services/blogArticleService";
import api from "../../services/api";

// Mock the api module
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
            // ARRANGE
            const mockArticles = [
                { id: 1, title: "Article 1" },
                { id: 2, title: "Article 2" }
            ];
            api.get.mockResolvedValue({ data: mockArticles });

            // ACT
            const result = await getAllBlogArticles();

            // ASSERT
            expect(api.get).toHaveBeenCalledWith("/blogArticles");
            expect(result).toEqual(mockArticles);
        });

        it("should handle network errors when fetching articles", async () => {
            // ARRANGE
            api.get.mockRejectedValue(new Error("Network Error"));

            // ACT & ASSERT
            await expect(getAllBlogArticles()).rejects.toThrow("Network Error");
        });
    });

    describe("createBlogArticle", () => {
        it("should create a blog article with FormData including image", async () => {
            // ARRANGE
            const articleData = {
                title: "New Article",
                description: "Description",
                dateCreation: "2023-01-01"
            };
            const imageFile = new File(["dummy"], "test.png", { type: "image/png" });
            const mockResponse = { id: 1, ...articleData };
            api.post.mockResolvedValue({ data: mockResponse });

            // ACT
            const result = await createBlogArticle(articleData, imageFile);

            // ASSERT
            expect(api.post).toHaveBeenCalledWith(
                "/blogArticles",
                expect.any(FormData),
                expect.objectContaining({
                    headers: { "Content-Type": "multipart/form-data" }
                })
            );
            expect(result).toEqual(mockResponse);
        });
    });
});
