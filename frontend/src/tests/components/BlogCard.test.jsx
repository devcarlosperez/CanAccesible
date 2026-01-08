import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import BlogCard from "../../components/blog/BlogCard";
import { useBlogTranslationStore } from "../../stores/blogTranslationStore";
import * as TranslationService from "../../services/translationService";

// Setup mocks for i18next and stores to isolate component testing
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { language: "es" } }),
}));

vi.mock("../../stores/blogTranslationStore", () => ({
  useBlogTranslationStore: vi.fn(),
}));

vi.mock("../../services/translationService", () => ({
  translateText: vi.fn(),
}));

describe("Component Test: BlogCard", () => {
  // Define mock data for the article and store state
  const mockArticle = {
    id: "1",
    title: "Test Article",
    description: "Test Description",
    nameFile: "test.jpg",
    dateCreation: "2023-01-01",
  };

  const mockStore = {
    isTranslated: vi.fn(),
    getTranslation: vi.fn(),
    setTranslatedText: vi.fn(),
    toggleTranslationStatus: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useBlogTranslationStore.mockReturnValue(mockStore);
    mockStore.isTranslated.mockReturnValue(false);
    mockStore.getTranslation.mockReturnValue(null);
  });

  // Verify that the card renders title, description and image correctly
  it("should render article details correctly (title, description, image)", () => {
    const { container } = render(
      <BrowserRouter>
        <BlogCard article={mockArticle} />
      </BrowserRouter>
    );

    expect(screen.getByText("Test Article")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(container.querySelector("img")).toHaveAttribute("src", "test.jpg");
  });

  // Simulate translation button click and verify service calls
  it("should call translation service and update store when translating", async () => {
    mockStore.isTranslated.mockReturnValue(false);
    TranslationService.translateText.mockResolvedValue("Translated Text");

    render(
      <BrowserRouter>
        <BlogCard article={mockArticle} />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByTitle("blog_card_translate_to_english"));

    await waitFor(() => {
      expect(TranslationService.translateText).toHaveBeenCalled();
      expect(mockStore.setTranslatedText).toHaveBeenCalled();
      expect(mockStore.toggleTranslationStatus).toHaveBeenCalledWith(
        mockArticle.id
      );
    });
  });
});
