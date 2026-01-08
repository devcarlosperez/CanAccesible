import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "../../pages/users/login/LoginForm";
import api from "../../services/api";
import useAuthStore from "../../services/authService";

vi.mock("jwt-decode", () => ({
  jwtDecode: () => ({
    exp: Date.now() / 1000 + 3600,
    id: 1,
    role: "user",
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

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

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
      { target: { value: "password123" } }
    );

    const submitButton = screen.getByRole("button", { name: /login_button/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
    });

    const [url, data, config] = api.post.mock.calls[0];
    expect(url).toBe("/auth/signin");
    expect(config.headers.Authorization).toContain("Basic");

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });

    expect(localStorage.getItem("token")).toBe(mockToken);
  });

  it("should handle login failure: User Input -> API Error -> Error Message Displayed", async () => {
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

    fireEvent.change(screen.getByPlaceholderText("login_email_placeholder"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("login_password_placeholder"),
      { target: { value: "wrongpass" } }
    );
    fireEvent.click(screen.getByRole("button", { name: /login_button/i }));

    await waitFor(() => {
      expect(screen.getByText("error_login_failed")).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
