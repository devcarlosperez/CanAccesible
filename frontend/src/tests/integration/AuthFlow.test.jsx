import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "../../pages/users/login/LoginForm";
import api from "../../services/api";
import useAuthStore from "../../services/authService";

// Mock jwt-decode
vi.mock("jwt-decode", () => ({
  jwtDecode: () => ({
    exp: Date.now() / 1000 + 3600, // Expires in 1 hour
    id: 1,
    role: "user",
  }),
}));
// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock api module (Axios)
vi.mock("../../services/api", () => {
  return {
    default: {
      post: vi.fn(),
      defaults: {
        headers: {
          common: {},
        },
      },
    },
  };
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// We need to make sure useAuthStore uses the mocked API
// Since useAuthStore imports api, and we mocked it, it should work.
// However, we need to ensure we are NOT mocking useAuthStore itself here,
// so we test the integration between Component -> Store -> API.

describe("Integration Test: Auth Flow (Login)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      error: null,
    });
  });

  it("should perform full login flow: User Input -> API Call -> Success -> Navigation", async () => {
    // 1. Arrange: Mock API success response
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

    // 2. Act: Fill form and submit
    fireEvent.change(screen.getByPlaceholderText("login_email_placeholder"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("login_password_placeholder"),
      { target: { value: "password123" } }
    );

    const submitButton = screen.getByRole("button", { name: /login_button/i });
    fireEvent.click(submitButton);

    // 3. Assert: API was called with correct data
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
    });

    const [url, data, config] = api.post.mock.calls[0];
    expect(url).toBe("/auth/signin");
    // The auth service sends empty body and Basic Auth headers
    expect(config.headers.Authorization).toContain("Basic");

    // 4. Assert: Navigation happened (Store updated state -> Component effect triggered)
    // We wait for the store to update and trigger the effect
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });

    // 5. Assert: Token persistence
    expect(localStorage.getItem("token")).toBe(mockToken);
  });

  it("should handle login failure: User Input -> API Error -> Error Message Displayed", async () => {
    // 1. Arrange: Mock API error response
    api.post.mockRejectedValueOnce({
      response: {
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

    // 2. Act
    fireEvent.change(screen.getByPlaceholderText("login_email_placeholder"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("login_password_placeholder"),
      { target: { value: "wrongpass" } }
    );
    fireEvent.click(screen.getByRole("button", { name: /login_button/i }));

    // 3. Assert
    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
