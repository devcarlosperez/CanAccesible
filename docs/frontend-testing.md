# Frontend Testing (React + Vitest)

Complete testing documentation for the CanAccesible frontend.

---

## Test Structure

The tests are organized into three main files within the `src/tests` directory:

- **Components:** `tests/components.test.jsx` - Tests individual UI components.
- **Integration:** `tests/integration.test.jsx` - Tests flows and component interactions.
- **Unit:** `tests/unit.test.js` - Tests pure logic and utilities.

---

## Requirements / Setup

- **Node.js**: LTS recommended (v18+)
- **Install dependencies**:

```bash
cd frontend
npm install
```

---

## How to Run Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run in watch mode (re-runs on save)
npx vitest --watch

# Run a specific file
npx vitest src/tests/unit.test.js

# Run tests matching a pattern
npx vitest -t "should fetch all blog articles"
```

### Code Coverage

```bash
npx vitest run --coverage
```

Report is generated in `coverage/`. Open `coverage/index.html` in browser for details.

---

## Test File Structure

```
frontend/src/tests/
├── components.test.jsx      # React component tests
├── integration.test.jsx     # Integration/Flow tests
└── unit.test.js             # Unit tests
```

---

## Writing Tests Guide

### AAA Principle (Arrange – Act – Assert)

All tests must follow this structure:

```javascript
it("should fetch all blog articles successfully", async () => {
  // ARRANGE
  const mockArticles = [{ id: 1, title: "Article 1" }];
  api.get.mockResolvedValue({ data: mockArticles });

  // ACT
  const result = await getAllBlogArticles();

  // ASSERT
  expect(api.get).toHaveBeenCalledWith("/blogArticles");
  expect(result).toEqual(mockArticles);
});
```

### Real Project Example

```javascript
it("should call translation service when translating", async () => {
  // ARRANGE
  mockStore.isTranslated.mockReturnValue(false);
  TranslationService.translateText.mockResolvedValue("Translated");

  // ACT
  render(
    <BrowserRouter>
      <BlogCard article={mockArticle} />
    </BrowserRouter>
  );

  // Simulate interaction
  fireEvent.click(screen.getByTitle("blog_card_translate_to_english"));

  // ASSERT
  await waitFor(() => {
    expect(TranslationService.translateText).toHaveBeenCalled();
  });
});
```

---

## Mocks and Isolation

### API Mocking

```javascript
vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    defaults: { headers: { common: {} } },
  },
}));
```

### React Dependencies Mocking

```javascript
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("../../stores/blogTranslationStore", () => ({
  useBlogTranslationStore: vi.fn(),
}));
```

### Mock Cleanup

```javascript
beforeEach(() => {
  vi.clearAllMocks();
});
```