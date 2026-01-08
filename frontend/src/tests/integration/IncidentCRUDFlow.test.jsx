import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import IncidentPage from "../../pages/incidents/Incident";
import api from "../../services/api";

vi.mock("../../services/api", () => {
  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    defaults: {
      headers: {
        common: {},
      },
    },
  };
  return { default: mockApi };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("../../services/authService.js", () => ({ 
    default: () => ({ 
        isAuthenticated: true, 
        user: { id: 1, role: 'user' },
        token: 'valid-jwt-token'
    }) 
}));

vi.mock("react-toastify", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        isActive: vi.fn().mockReturnValue(false)
    }
}));

vi.mock("react-leaflet", () => ({
  MapContainer: () => <div>Map</div>,
  TileLayer: () => <div>Tile</div>,
  Marker: () => <div>Marker</div>,
  Popup: () => <div>Popup</div>,
  useMapEvents: () => null,
}));

vi.mock("../../components/incidents/IncidentForm", () => ({
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
                        imageFile: new File([""], "test.png", { type: "image/png" })
                    });
                    onSubmit(e);
                  }}
                >
                  Confirm Create
                </button>
            </div>
        );
    }
}));

vi.mock("../../components/incidents/IncidentCard", () => ({
    default: ({ incident, onDelete }) => (
        <div data-testid="incident-item">
            <span>{incident.name}</span>
            <button onClick={() => onDelete(incident.id)}>Delete</button>
        </div>
    )
}));

vi.mock("../../components/header/Header", () => ({ default: () => <div>Header</div> }));
vi.mock("../../components/footer/Footer", () => ({ default: () => <div>Footer</div> }));
vi.mock("motion/react", () => ({ 
    motion: { 
        main: ({ children, ...props }) => <main {...props}>{children}</main> 
    } 
}));

describe("Integration Flow: Incidents CRUD (Flow 2)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        api.defaults.headers.common['Authorization'] = 'Bearer valid-jwt-token';
    });

    it("should complete a Create -> Refresh List flow and verify Header Interceptor", async () => {
        const initialList = [];
        const updatedList = [
            { id: 99, name: "New Integration Incident", isApproved: true, user: { id: 1 } }
        ];

        api.get.mockResolvedValueOnce({ data: initialList }) 
               .mockResolvedValueOnce({ data: updatedList }); 

        api.post.mockResolvedValue({ data: { id: 99 } });

        render(
            <BrowserRouter>
                <IncidentPage />
            </BrowserRouter>
        );

        await waitFor(() => expect(api.get).toHaveBeenCalledWith("/incidents"));
        expect(screen.queryByText("New Integration Incident")).not.toBeInTheDocument();

        const createBtn = screen.getByText("incidents_new");
        fireEvent.click(createBtn);

        const confirmBtn = await screen.findByText("Confirm Create");
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledTimes(1);
        });
        
        expect(api.post.mock.calls[0][0]).toBe("/incidents");
        
        expect(api.defaults.headers.common['Authorization']).toBe('Bearer valid-jwt-token');

        await waitFor(() => {
            expect(api.get.mock.calls.length).toBeGreaterThanOrEqual(2);
        });
        
        expect(await screen.findByText("New Integration Incident")).toBeInTheDocument();
    });

    it("should handle Server Error (500) on Creation gracefully", async () => {
         api.get.mockResolvedValue({ data: [] });
         api.post.mockRejectedValue({ response: { status: 500, data: { message: "Server Error" } } });

         render(
             <BrowserRouter>
                 <IncidentPage />
             </BrowserRouter>
         );

         const createBtn = screen.getByText("incidents_new");
         fireEvent.click(createBtn);
         const confirmBtn = await screen.findByText("Confirm Create");
         fireEvent.click(confirmBtn);

         await waitFor(() => {
             expect(api.post).toHaveBeenCalled();
         });
         
         expect(api.get).toHaveBeenCalledTimes(1);
    });

    it("should delete an incident and update list", async () => {
        const list = [{ id: 10, name: "To Delete", isApproved: true, user: { id: 1 } }];
        
        api.get.mockResolvedValueOnce({ data: list })
               .mockResolvedValue({ data: [] }); 

        api.delete.mockResolvedValue({ data: {} });

        render(
            <BrowserRouter>
                 <IncidentPage />
            </BrowserRouter>
        );

        expect(await screen.findByText("To Delete")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Delete"));

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith("/incidents/10");
        });

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledTimes(2); 
        });

        await waitFor(() => {
             expect(screen.queryByText("To Delete")).not.toBeInTheDocument();
        });
    });
});
