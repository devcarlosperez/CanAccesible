# Frontend Testing (React + Vitest)

Complete testing documentation for the CanAccesible frontend.

---

## Work Distribution

### Carlos

- **Components:** `BlogCard` (`tests/components/BlogCard.test.jsx`)
- **Integration:** `ChatFlow` (`tests/integration/ChatFlow.test.jsx`)
- **Utilities:** `textUtils` (`tests/unit/textUtils.test.js`), `blogArticleService` (`tests/unit/blogArticleService.test.js`)

### Jonathan

- **Components:** `Footer` (`tests/components/Footer.test.jsx`), `LoginForm` (`tests/components/LoginForm.test.jsx`)
- **Integration:** `AuthFlow` (`tests/integration/AuthFlow.test.jsx`)
- **Utilities:** `dateUtils` (`tests/unit/dateUtils.test.js`)

### Iriome

- **Components:** `Incident` (`tests/components/Incident.test.jsx`)
- **Integration:** `IncidentDataFlow` (`tests/integration/IncidentCRUDFlow.test.jsx`)
- **Utilities:** `incidentHelpers` (`tests/unit/incidentHelpers.test.js`)

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
npx vitest src/tests/unit/textUtils.test.js

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
├── unit/                    # Pure logic tests (utils, services)
│   ├── blogArticleService.test.js
│   ├── dateUtils.test.js
│   ├── incidentHelpers.test.js
│   └── textUtils.test.js
├── components/              # React component tests
│   ├── BlogCard.test.jsx
│   ├── Footer.test.jsx
│   ├── Incident.test.jsx
│   └── LoginForm.test.jsx
└── integration/             # Full flow tests
    ├── AuthFlow.test.jsx
    ├── ChatFlow.test.jsx
    └── IncidentCRUDFlow.test.jsx
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
