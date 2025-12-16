import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "../../pages/users/login/LoginForm";
import useAuthStore from "../../services/authService";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock useAuthStore
vi.mock("../../services/authService", () => ({
  default: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Component Test: LoginForm", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default store mock behavior
    useAuthStore.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  it("should render login form elements", () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    expect(
      screen.getByPlaceholderText("login_email_placeholder")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("login_password_placeholder")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /login_button/i })
    ).toBeInTheDocument();
  });

  it("should update input values on change", () => {
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
  });

  it("should call login function on form submission", () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText("login_email_placeholder");
    const passwordInput = screen.getByPlaceholderText(
      "login_password_placeholder"
    );
    const submitButton = screen.getByRole("button", { name: /login_button/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("should display error message when error exists in store", () => {
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

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("should show loading state on button", () => {
    useAuthStore.mockReturnValue({
      login: mockLogin,
      loading: true,
      error: null,
      isAuthenticated: false,
    });

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    expect(screen.getByRole("button")).toHaveTextContent("login_loading");
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
