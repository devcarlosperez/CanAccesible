import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import useAuthStore from "../../../services/authService";
import { createUser } from "../../../services/userService";

// 1. Mock authentication hook
vi.mock("../../../services/authService");

// 2. Mock user service
vi.mock("../../../services/userService");

// 3. Mock react-router navigation hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 4. Mock URL.createObjectURL for image preview
global.URL.createObjectURL = vi.fn(() => "mocked-image-url");

describe("RegisterForm Component", () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <RegisterForm />
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
    // Default configuration for createUser
    createUser.mockResolvedValue({ success: true });
  });

  it("should render the form correctly", () => {
    renderComponent();

    expect(screen.getByPlaceholderText("Nombre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Apellidos")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Correo electrónico")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
    expect(screen.getByText("Tipo de cuenta")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /registrarse/i })
    ).toBeInTheDocument();
  });

  it("should allow typing in inputs", () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Apellidos"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "password123" },
    });

    expect(screen.getByPlaceholderText("Nombre").value).toBe("John");
    expect(screen.getByPlaceholderText("Apellidos").value).toBe("Doe");
    expect(screen.getByPlaceholderText("Correo electrónico").value).toBe(
      "john@example.com"
    );
    expect(screen.getByPlaceholderText("Contraseña").value).toBe("password123");
  });

  it("should allow selecting a role", () => {
    renderComponent();

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "1" } });

    expect(select.value).toBe("1");
  });

  it("should call createUser and login with correct data on submit", async () => {
    const mockLogin = vi.fn();
    useAuthStore.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
      isAuthenticated: false,
    });

    renderComponent();

    // Fill form
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Apellidos"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });

    // Submit
    const submitButton = screen.getByRole("button", { name: /registrarse/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createUser).toHaveBeenCalled();
      // Verify FormData content indirectly or just that it was called
      const formData = createUser.mock.calls[0][0];
      expect(formData.get("firstName")).toBe("John");
      expect(formData.get("email")).toBe("john@example.com");

      expect(mockLogin).toHaveBeenCalledWith("john@example.com", "password123");
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  it("should show an error message if registration fails", async () => {
    createUser.mockRejectedValue(new Error("Registration failed"));

    renderComponent();

    // Fill form minimally to enable submit
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Apellidos"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });

    fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

    await waitFor(() => {
      expect(
        screen.getByText("No se pudo registrar el usuario")
      ).toBeInTheDocument();
    });
  });

  it("should handle file upload preview", () => {
    const { container } = render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );

    const file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });

    // Find input by type since label association is missing in component
    const input = container.querySelector('input[type="file"]');

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByAltText("preview")).toBeInTheDocument();
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
  });
});
