import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import BlogCard from "../../components/blog/BlogCard";
import { useBlogTranslationStore } from "../../stores/blogTranslationStore";
import * as TranslationService from "../../services/translationService";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'es' }
  }),
}));

// Mock store
vi.mock("../../stores/blogTranslationStore", () => ({
  useBlogTranslationStore: vi.fn(),
}));

// Mock translation service
vi.mock("../../services/translationService", () => ({
  translateText: vi.fn(),
}));

describe("Component Test: BlogCard", () => {
    const mockArticle = {
        id: "1",
        title: "Test Article",
        description: "Test Description",
        nameFile: "test.jpg",
        dateCreation: "2023-01-01"
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
        // Default: not translated
        mockStore.isTranslated.mockReturnValue(false);
        mockStore.getTranslation.mockReturnValue(null);
    });

    it("should render article details correctly", () => {
        render(
            <BrowserRouter>
                <BlogCard article={mockArticle} />
            </BrowserRouter>
        );

        expect(screen.getByText("Test Article")).toBeInTheDocument();
        expect(screen.getByText("Test Description")).toBeInTheDocument();
        // Assuming nameFile is used as src
        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", "test.jpg");
    });

    it("should call toggleTranslationStatus when translate button is clicked and already translated", () => {
        mockStore.isTranslated.mockReturnValue(true);
        mockStore.getTranslation.mockReturnValue({ title: "Translated Title", description: "Translated Desc" });

        render(
            <BrowserRouter>
                <BlogCard article={mockArticle} />
            </BrowserRouter>
        );

        // Find button by logic known from JSX: it has text 'EN' if isTranslated is true (and language is Spanish implicitly or Logic)
        // Or simply get all buttons
        const buttons = screen.getAllByRole("button");
        // In the JSX, the translation button has a title attribute.
        // title={isTranslated ? t('blog_card_view_original') : t('blog_card_translate_to_english')}
        // Since t returns key: 'blog_card_view_original'
        const translateBtn = screen.getByTitle("blog_card_view_original");

        fireEvent.click(translateBtn);

        expect(mockStore.toggleTranslationStatus).toHaveBeenCalledWith(mockArticle.id);
    });

    it("should call translateText and update store when translating for the first time", async () => {
        mockStore.isTranslated.mockReturnValue(false);
        TranslationService.translateText.mockResolvedValue("Translated Text");

        render(
            <BrowserRouter>
                <BlogCard article={mockArticle} />
            </BrowserRouter>
        );

        const translateBtn = screen.getByTitle("blog_card_translate_to_english");

        fireEvent.click(translateBtn);

        await waitFor(() => {
            expect(TranslationService.translateText).toHaveBeenCalled();
            expect(mockStore.setTranslatedText).toHaveBeenCalled();
            expect(mockStore.toggleTranslationStatus).toHaveBeenCalledWith(mockArticle.id);
        });
    });
});
