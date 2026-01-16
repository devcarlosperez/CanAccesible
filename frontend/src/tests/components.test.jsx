import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";

// GLOBAL MOCKS
const translations = {
  footer_description:
    "CANACCESIBLE promueve un mundo más inclusivo mediante la tecnología y la accesibilidad digital.",
  company: "Compañía",
  help: "Ayuda",
  our_mission: "Nuestra misión",
  all_rights_reserved: "© CANACCESIBLE 2025, All Rights Reserved",
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => translations[key] || key,
    i18n: { language: "es" },
  }),
}));

// Auth store mock
vi.mock("../services/authService", () => ({
  default: vi.fn(),
}));

// Navigation mock
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mocks for IncidentDetail
vi.mock("../services/incidentService", () => ({
  getIncidentById: vi.fn(),
}));

vi.mock("../services/incidentLikesService", () => ({
  getAllIncidentLikes: vi.fn(),
}));

vi.mock("../services/socketService", () => ({
  initSocket: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
  })),
}));

vi.mock("../stores/incidentTranslationStore", () => ({
  useIncidentTranslationStore: () => ({
    isTranslated: () => false,
    getTranslation: () => null,
    setTranslatedText: vi.fn(),
    toggleTranslationStatus: vi.fn(),
  }),
}));

vi.mock("../components/header/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock("../components/incidents/IncidentCommentSection", () => ({
  default: () => <div data-testid="comments">Comments</div>,
}));

import Footer from "../components/footer/Footer";
import LoginForm from "../pages/users/login/LoginForm";
import useAuthStore from "../services/authService";
import IncidentDetail from "../pages/incidents/IncidentDetail";
import * as incidentService from "../services/incidentService";
import * as incidentLikesService from "../services/incidentLikesService";

// COMPONENT 1: Footer (Static/Presentation Component)
describe("Component Test: Footer (Static/Presentation)", () => {
  it("should render logo, description and navigation links without API calls", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    expect(screen.getByAltText("canaccesible-logo")).toBeInTheDocument();
    expect(
      screen.getByText(/CANACCESIBLE promueve un mundo más inclusivo/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Compañía")).toBeInTheDocument();
    expect(screen.getByText("Ayuda")).toBeInTheDocument();

    expect(
      screen.getByLabelText("Visita nuestro canal de YouTube")
    ).toHaveAttribute(
      "href",
      "https://www.youtube.com/channel/UC_IICs-9f1KYxOuIBQxfQ0g"
    );
  });
});

// COMPONENT 2: LoginForm (Authentication/Interaction Component)
describe("Component Test: LoginForm (Auth/Interaction)", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  it("should render form elements and update input values on user interaction", () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText("login_email_placeholder");
    const passwordInput = screen.getByPlaceholderText(
      "login_password_placeholder"
    );

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
    expect(
      screen.getByRole("button", { name: /login_button/i })
    ).toBeInTheDocument();
  });

  it("should call login function and display error message on failed authentication", async () => {
    useAuthStore.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: "Invalid credentials",
      isAuthenticated: false,
    });

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("login_email_placeholder"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("login_password_placeholder"),
      {
        target: { value: "wrongpass" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /login_button/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("wrong@example.com", "wrongpass");
    });
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });
});

// COMPONENT 3: IncidentDetail
describe("Component Test: IncidentDetail (Async - 3 States)", () => {
  const mockIncident = {
    id: 1,
    name: "Test Incident",
    description: "Testing async component states.",
    area: "Test Zone",
    incidentStatusId: 1,
    incidentSeverityId: 1,
    isApproved: true,
    user: { id: 2, username: "creator" },
  };

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={["/incidents/1"]}>
        <Routes>
          <Route path="/incidents/:id" element={<IncidentDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Re-mock authService for IncidentDetail
    useAuthStore.mockReturnValue({
      user: { id: 1, role: "user" },
      token: "fake-token",
      isAuthenticated: true,
    });
  });

  // State 1: LOADING
  it("should show loading state initially while fetching data", async () => {
    // Arrange: mock that never resolves (simulates loading)
    incidentService.getIncidentById.mockImplementation(
      () => new Promise(() => {})
    );
    incidentLikesService.getAllIncidentLikes.mockImplementation(
      () => new Promise(() => {})
    );

    // Act
    renderComponent();

    // Assert
    expect(screen.getByText("incident_loading")).toBeInTheDocument();
  });

  // State 2: SUCCESS
  it("should display incident details on successful fetch", async () => {
    // Arrange: mock with successful response
    incidentService.getIncidentById.mockResolvedValue(mockIncident);
    incidentLikesService.getAllIncidentLikes.mockResolvedValue([]);

    // Act
    renderComponent();

    // Assert: use findBy to wait for async rendering
    expect(await screen.findByText("Test Incident")).toBeInTheDocument();
    expect(
      screen.getByText("Testing async component states.")
    ).toBeInTheDocument();
    expect(incidentService.getIncidentById).toHaveBeenCalledWith("1");
  });

  // State 3: ERROR
  it("should display error message on fetch failure", async () => {
    // Arrange: mock with network error
    incidentService.getIncidentById.mockRejectedValue(
      new Error("Network Error")
    );
    incidentLikesService.getAllIncidentLikes.mockResolvedValue([]);

    // Act
    renderComponent();

    // Assert: use waitFor to wait for error message
    await waitFor(() => {
      expect(screen.getByText("incident_load_error")).toBeInTheDocument();
    });
  });
});
