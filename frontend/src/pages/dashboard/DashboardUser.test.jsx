import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import DashboardUser from "./DashboardUser";
import useAuthStore from "../../services/authService";
import { getMyIncidents } from "../../services/incidentService";
import { getAllNotifications } from "../../services/notificationService";

// Mock services
vi.mock("../../services/authService");
vi.mock("../../services/incidentService");
vi.mock("../../services/notificationService");

// Mock router
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock child components to avoid cluttering the test
vi.mock("../../components/header/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));
vi.mock("../../components/footer/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

describe("DashboardUser Component", () => {
  const mockUser = {
    firstName: "Carlos",
    email: "carlos@gmail.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    useAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    });

    getMyIncidents.mockResolvedValue([]);
    getAllNotifications.mockResolvedValue([]);
  });

  it("should render the dashboard if the user is authenticated", async () => {
    render(
      <BrowserRouter>
        <DashboardUser />
      </BrowserRouter>
    );

    // Check for welcome message
    await waitFor(() => {
      expect(screen.getByText(/Hola Carlos/i)).toBeInTheDocument();
    });

    // Check for Header and Footer
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();

    // Check for stats titles (static text)
    expect(screen.getByText("INCIDENCIAS PENDIENTES")).toBeInTheDocument();
    expect(screen.getByText("INCIDENCIAS PUBLICADAS")).toBeInTheDocument();
  });

  it("should show loading state initially", () => {
    // Mock promises that don't resolve immediately to keep loading state true
    getMyIncidents.mockReturnValue(new Promise(() => {}));
    getAllNotifications.mockReturnValue(new Promise(() => {}));

    render(
      <BrowserRouter>
        <DashboardUser />
      </BrowserRouter>
    );

    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  it("should handle API errors gracefully", async () => {
    // Silenciar console.error para que no ensucie el output del test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Simular error en la API
    getMyIncidents.mockRejectedValue(new Error("Error de red"));

    render(
      <BrowserRouter>
        <DashboardUser />
      </BrowserRouter>
    );

    // Esperar a que el componente intente cargar y falle (el useEffect catch el error)
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    // Verificar que se muestran los mensajes de estado vacío (ya que la carga falló)
    expect(
      screen.getByText("No hay notificaciones recientes")
    ).toBeInTheDocument();
    expect(
      screen.getByText("No tienes incidencias con likes aún")
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
