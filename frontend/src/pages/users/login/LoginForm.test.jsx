import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "./LoginForm";
import useAuthStore from "../../../services/authService";

// 1. Mock authentication hook
vi.mock("../../../services/authService");

// 2. Mock react-router navigation hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginForm Component", () => {
  // Helper function to render with Router (needed for <Link> component)
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default configuration for mocked store
    useAuthStore.mockReturnValue({
      login: vi.fn(),
      loading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  it("should render the form correctly", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
  });

  it("should allow typing in inputs", () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Contraseña");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("should call login function with correct data on submit", async () => {
    const mockLogin = vi.fn();
    useAuthStore.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
      isAuthenticated: false,
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "juan@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "123456" },
    });

    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith("juan@test.com", "123456");
  });

  it("should show an error message if login fails", () => {
    useAuthStore.mockReturnValue({
      login: vi.fn(),
      loading: false,
      error: "Credenciales inválidas", // Simulate an error
      isAuthenticated: false,
    });

    renderComponent();

    expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument();
  });

  it("should disable the button while loading", () => {
    useAuthStore.mockReturnValue({
      login: vi.fn(),
      loading: true, // Simulate loading state
      error: null,
      isAuthenticated: false,
    });

    renderComponent();

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Cargando...");
  });

  it("should redirect to /home when user is authenticated", () => {
    useAuthStore.mockReturnValue({
      login: vi.fn(),
      loading: false,
      error: null,
      isAuthenticated: true, // Simulate user is already logged in
    });

    renderComponent();

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });
});
