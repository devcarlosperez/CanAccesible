// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import IncidentDetail from "../../pages/incidents/IncidentDetail";
import * as incidentService from "../../services/incidentService";
import * as incidentLikesService from "../../services/incidentLikesService";

// --- Mocks ---

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "es" },
  }),
}));

vi.mock("../../services/incidentService", () => ({
  getIncidentById: vi.fn(),
}));

vi.mock("../../services/incidentLikesService", () => ({
  getAllIncidentLikes: vi.fn(),
}));

vi.mock("../../services/socketService", () => ({
  initSocket: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
  })),
}));

vi.mock("../../services/authService.js", () => ({
  default: () => ({
    user: { id: 1, role: "user" },
    token: "fake-token",
  }),
}));

vi.mock("../../stores/incidentTranslationStore", () => ({
  useIncidentTranslationStore: () => ({
    isTranslated: () => false,
    getTranslation: () => null,
    setTranslatedText: vi.fn(),
    toggleTranslationStatus: vi.fn(),
  }),
}));

vi.mock("../../components/header/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));
vi.mock("../../components/footer/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));
vi.mock("../../components/incidents/IncidentCommentSection", () => ({
  default: () => <div data-testid="comments">Comments</div>,
}));

describe("Component Test: IncidentDetail (Async)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockIncident = {
    id: 1,
    name: "Async Incident Detail",
    description: "Testing async loading states.",
    area: "Zona Test",
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

  it("should show loading state initially", async () => {
    incidentService.getIncidentById.mockImplementation(() => new Promise(() => {})); 
    incidentLikesService.getAllIncidentLikes.mockImplementation(() => new Promise(() => {}));

    renderComponent();

    expect(screen.getByText("incident_loading")).toBeInTheDocument();
  });

  it("should display incident details on successful fetch", async () => {
    incidentService.getIncidentById.mockResolvedValue(mockIncident);
    incidentLikesService.getAllIncidentLikes.mockResolvedValue([]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Async Incident Detail")).toBeInTheDocument();
    });
    
    expect(screen.getByText("Testing async loading states.")).toBeInTheDocument();
    expect(incidentService.getIncidentById).toHaveBeenCalledWith("1");
  });

  it("should display error message on fetch failure", async () => {
    const errorMsg = "Network Error";
    incidentService.getIncidentById.mockRejectedValue(new Error(errorMsg));
    incidentLikesService.getAllIncidentLikes.mockResolvedValue([]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("incident_load_error")).toBeInTheDocument();
    });
  });
});
