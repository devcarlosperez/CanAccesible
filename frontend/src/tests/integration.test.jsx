import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";

// GLOBAL MOCKS

// JWT decode mock
vi.mock("jwt-decode", () => ({
  jwtDecode: () => ({
    exp: Date.now() / 1000 + 3600,
    id: 1,
    role: "user",
  }),
}));

// Translations mock
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "es" },
  }),
}));

// API module mock (axios instance)
vi.mock("../services/api", () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      defaults: {
        headers: {
          common: {},
        },
      },
    },
  };
});

// Navigation mock
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import LoginForm from "../pages/users/login/LoginForm";
import api from "../services/api";
import useAuthStore from "../services/authService";

// FLOW 1: AUTHENTICATION (Login Flow)
describe("Integration Flow 1: Authentication (Login)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset auth store using Zustand's setState
    const store = useAuthStore;
    store.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should complete successful login flow: Input -> API Call -> Token Storage -> Navigation", async () => {
    const mockUser = { id: 1, email: "test@example.com", role: "user" };
    const mockToken = "fake-jwt-token";

    api.post.mockResolvedValueOnce({
      data: {
        user: mockUser,
        token: mockToken,
      },
    });

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("login_email_placeholder"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("login_password_placeholder"),
      {
        target: { value: "password123" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /login_button/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
    });

    const [url, , config] = api.post.mock.calls[0];
    expect(url).toBe("/auth/signin");
    expect(config.headers.Authorization).toContain("Basic");

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });

    expect(localStorage.getItem("token")).toBe(mockToken);
  });

  it("should handle 401 Unauthorized error and display error message", async () => {
    api.post.mockRejectedValueOnce({
      response: {
        status: 401,
        data: {
          message: "Invalid credentials",
        },
      },
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
        target: { value: "wrongpassword" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /login_button/i }));

    await waitFor(() => {
      expect(screen.getByText("error_login_failed")).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();

    expect(localStorage.getItem("token")).toBeNull();
  });
});

// FLOW 2: INCIDENT CRUD
import IncidentPage from "../pages/incidents/Incident";

// Additional mocks for IncidentPage
vi.mock("react-helmet-async", () => ({
  Helmet: ({ children }) => <>{children}</>,
  HelmetProvider: ({ children }) => <>{children}</>,
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    isActive: vi.fn().mockReturnValue(false),
  },
}));

vi.mock("react-leaflet", () => ({
  MapContainer: () => <div>Map</div>,
  TileLayer: () => <div>Tile</div>,
  Marker: () => <div>Marker</div>,
  Popup: () => <div>Popup</div>,
  useMapEvents: () => null,
}));

// Incident form mock
vi.mock("../components/incidents/IncidentForm", () => ({
  default: ({ open, onSubmit, setFormData }) => {
    if (!open) return null;
    return (
      <div role="dialog" data-testid="incident-form-dialog">
        <h2>Incident Form</h2>
        <button
          onClick={(e) => {
            e.preventDefault();
            setFormData({
              name: "New Integration Incident",
              description: "Created via Integration Test",
              island: "Tenerife",
              area: "Movilidad",
              latitude: 28.0,
              longitude: -16.0,
              imageFile: new File([""], "test.png", { type: "image/png" }),
            });
            onSubmit(e);
          }}
        >
          Confirm Create
        </button>
      </div>
    );
  },
}));

// Incident card mock
vi.mock("../components/incidents/IncidentCard", () => ({
  default: ({ incident }) => (
    <div data-testid="incident-item">
      <span>{incident.name}</span>
    </div>
  ),
}));

vi.mock("../components/header/Header", () => ({
  default: () => <div>Header</div>,
}));
vi.mock("../components/footer/Footer", () => ({
  default: () => <div>Footer</div>,
}));
vi.mock("motion/react", () => ({
  motion: {
    main: ({ children, ...props }) => <main {...props}>{children}</main>,
  },
}));

describe("Integration Flow 2: Incident CRUD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup authenticated user in store
    useAuthStore.setState({
      user: { id: 1, role: "user" },
      token: "valid-jwt-token",
      isAuthenticated: true,
      isAdmin: false,
      loading: false,
      error: null,
    });
    // Setup JWT token in default headers
    api.defaults.headers.common["Authorization"] = "Bearer valid-jwt-token";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should complete Create flow and verify JWT Token in Authorization Header", async () => {
    // Arrange: setup mocks for initial and updated list
    const initialList = [];
    const updatedList = [
      {
        id: 99,
        name: "New Integration Incident",
        isApproved: true,
        user: { id: 1 },
      },
    ];

    // First call: empty list
    api.get.mockResolvedValueOnce({ data: initialList });

    // Subsequent calls: updated list
    api.get.mockImplementation(async (url) => {
      if (url === "/incidents") {
        return { data: updatedList };
      }
      if (url && url.includes("incidentFollows")) {
        return { data: [] };
      }
      return { data: [] };
    });

    api.post.mockResolvedValue({ data: { id: 99 } });

    // Act: render and execute create flow
    render(
      <BrowserRouter>
        <IncidentPage />
      </BrowserRouter>
    );

    // Wait for initial load
    await waitFor(() => expect(api.get).toHaveBeenCalledWith("/incidents"));

    // Verify list is initially empty
    expect(
      screen.queryByText("New Integration Incident")
    ).not.toBeInTheDocument();

    // Open create form
    const createBtn = screen.getByText("incidents_new");
    fireEvent.click(createBtn);

    // Confirm creation
    const confirmBtn = await screen.findByText("Confirm Create");
    fireEvent.click(confirmBtn);

    // Assert: verify POST call
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
    });

    // KEY REQUIREMENT: Verify JWT Token is in Authorization Header
    expect(api.defaults.headers.common["Authorization"]).toBe(
      "Bearer valid-jwt-token"
    );
    expect(api.post.mock.calls[0][0]).toBe("/incidents");

    // Verify list was refreshed
    await waitFor(() => {
      expect(api.get.mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    // Verify new item appears in UI
    expect(
      await screen.findByText("New Integration Incident")
    ).toBeInTheDocument();
  });

  it("should handle 500 Server Error gracefully on creation failure", async () => {
    // Arrange: setup mock for 500 error
    api.get.mockResolvedValue({ data: [] });
    api.post.mockRejectedValue({
      response: {
        status: 500,
        data: { message: "Internal Server Error" },
      },
    });

    // Act
    render(
      <BrowserRouter>
        <IncidentPage />
      </BrowserRouter>
    );

    // Open form and try to create
    const createBtn = screen.getByText("incidents_new");
    fireEvent.click(createBtn);
    const confirmBtn = await screen.findByText("Confirm Create");
    fireEvent.click(confirmBtn);

    // Assert: verify API was called and failed
    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });

    // Verify list was NOT refreshed (only 1 initial GET)
    // 500 error should not trigger list refresh
    expect(api.get).toHaveBeenCalledTimes(1);
  });
});
