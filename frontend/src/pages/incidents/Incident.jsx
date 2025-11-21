import { useEffect, useState } from "react";
import { getAllIncidents, createIncident, updateIncident, deleteIncident } from "../../services/incidentService";
import useAuthStore from "../../services/authService.js";
import IncidentForm from "../../components/incidents/IncidentForm";
import IncidentList from "../../components/incidents/IncidentList";

import { Button, Typography, Dialog, DialogContent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const Incident = () => {
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingIncident, setEditingIncident] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const initialFormData = {
    name: "",
    description: "",
    incidentStatusId: 1,
    incidentTypeId: 1,
    incidentSeverityId: 1,
    userId: 1,
    island: "",
    area: "",
    latitude: "",
    longitude: "",
    dateIncident: new Date().toISOString().split("T")[0],
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const data = await getAllIncidents();
      setIncidents(data);
    } catch (err) {
      console.error("Error cargando incidencias:", err);
    }
  };

  const { isAuthenticated } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const preparedData = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };
      const data = new FormData();
      Object.keys(preparedData).forEach((key) => {
        if (key !== "imageFile") {
          data.append(key, preparedData[key]);
        }
      });
      if (formData.imageFile) {
        data.append("image", formData.imageFile);
      }
      if (editingIncident) {
        await updateIncident(editingIncident.id, data);
      } else {
        await createIncident(data);
      }
      setFormData(initialFormData);
      setEditingIncident(null);
      setShowForm(false);
      fetchIncidents();
    } catch (err) {
      console.error("Error guardando incidencia:", err);
    }
  };

  const handleEdit = (incident) => {
    setEditingIncident(incident);
    setFormData({ ...incident });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteIncident(id);
      fetchIncidents();
    } catch (err) {
      console.error("Error eliminando incidencia:", err);
    }
  };

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section>
      <Header transparent={false} />
      <div className="pt-40 p-8">
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
          Gestión de Incidencias
        </Typography>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          {isAuthenticated && !showForm && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                setShowForm(true);
                setFormData(initialFormData);
                setEditingIncident(null);
              }}
            >
              Nueva Incidencia
            </Button>
          )}
        </div>

        {/* Modal Form */}
        <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="md" fullWidth>
          <DialogContent>
            <IncidentForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              editingIncident={editingIncident}
              onCancel={() => {
                setShowForm(false);
                setFormData(initialFormData);
                setEditingIncident(null);
              }}
              open={showForm}
              setOpen={setShowForm}
            />
          </DialogContent>
        </Dialog>

        <IncidentList
          incidents={incidents}
          users={users}
          expandedId={expandedId}
          onExpandClick={handleExpandClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
      <Footer />
    </section>
  );
};

export default Incident;
