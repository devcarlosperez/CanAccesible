import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllIncidents, createIncident, updateIncident, deleteIncident } from "../../services/incidentService";
import { getIncidentLikeByIncidentAndUserId, createIncidentLike, deleteIncidentLike } from "../../services/incidentLikesService";
import { getIncidentFollowsByIncidentId, getIncidentFollowByIncidentAndUserId, createIncidentFollow, deleteIncidentFollow } from "../../services/incidentFollowsService.js";
import { createNotification } from "../../services/notificationService.js";

import useAuthStore from "../../services/authService.js";
import IncidentForm from "../../components/incidents/IncidentForm";
import IncidentList from "../../components/incidents/IncidentList";

import { Button, Dialog, DialogContent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import "react-toastify/dist/ReactToastify.css";

const Incident = () => {
  const { t } = useTranslation();
  const [incidents, setIncidents] = useState([]);
  const [users] = useState([]);
  const [editingIncident, setEditingIncident] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);

  const [viewMoreIncidentId, setViewMoreIncidentId] = useState(null);
  const [lastErrorToastId, setLastErrorToastId] = useState(null);
  const { isAuthenticated, user } = useAuthStore();

  const location = useLocation();
  const navigate = useNavigate();

  const itemsPerPage = 6;

  const initialFormData = {
    name: "",
    description: "",
    incidentStatusId: 3,
    incidentTypeId: 1,
    incidentSeverityId: 1,
    userId: isAuthenticated ? user.id : null,
    island: "",
    area: "",
    latitude: "",
    longitude: "",
    isApproved: false,
    dateIncident: new Date().toISOString().split("T")[0],
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const incidentId = params.get("incidentId");
    if (incidentId) {
      setViewMoreIncidentId(incidentId);
    }
  }, [location.search, incidents]);

  const fetchIncidents = async () => {
    try {
      const data = await getAllIncidents();
      setIncidents(data);
    } catch (err) {
      // Silently fail
    }
  };

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
      let updatedIncidentId = null;
      if (editingIncident) {
        await updateIncident(editingIncident.id, data);
        updatedIncidentId = editingIncident.id;
      } else {
        const created = await createIncident(data);
        updatedIncidentId = created.id;
      }
      setFormData(initialFormData);
      setEditingIncident(null);
      setShowForm(false);
      fetchIncidents();

      // Notify followers if an incident was updated
      if (updatedIncidentId) {
        const followers = await getIncidentFollowsByIncidentId(
          updatedIncidentId
        );
        for (const follower of followers) {
          await createNotification({
            userId: follower.userId,
            message: t('incident_updated', { name: formData.name }),
            entity: "IncidentFollow",
            entityId: updatedIncidentId,
            dateNotification: new Date().toISOString().split("T")[0],
          });
        }
      }

      if (!editingIncident) {
        toast.success(t('incidents_sent_for_review'));
      }
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

  const showErrorToast = (message) => {
    if (lastErrorToastId) {
      const isActive = toast.isActive(lastErrorToastId);
      if (isActive) return;
    }

    const isMobile = window.innerWidth < 768;
    const position = isMobile ? "bottom-center" : "bottom-right";

    const toastId = toast.error(message, {
      autoClose: 5000,
      position: position,
      hideProgressBar: false,
      closeButton: true,
      style: isMobile ? { fontSize: "14px", padding: "16px" } : {},
    });
    setLastErrorToastId(toastId);
  };

  const handleLike = async (incident) => {
    try {
      // If the user is not logged in, show an error and return
      if (!isAuthenticated) {
        showErrorToast(t('incidents_like_login'));
        return;
      }

      // Find existing like by this user for the incident
      const existingLike = await getIncidentLikeByIncidentAndUserId(
        incident.id,
        user.id
      );

      if (!existingLike) {
        // If no like exists, create a new one
        await createIncidentLike({
          incidentId: incident.id,
          userId: user.id,
          dateLike: new Date().toISOString(),
        });
      } else {
        // If like exists, delete it
        await deleteIncidentLike(existingLike.id);
      }

      fetchIncidents();
    } catch (err) {
      console.error("Error al gestionar el like:", err);
    }
  };

  const handleFollow = async (incident) => {
    try {
      // If the user is not logged in, show an error and return
      if (!isAuthenticated) {
        showErrorToast(t('incidents_follow_login'));
        return;
      }

      // Find existing follow by this user for the incident
      const existingFollow = await getIncidentFollowByIncidentAndUserId(
        incident.id,
        user.id
      );

      if (!existingFollow) {
        // If no follow exists, create a new one
        await createIncidentFollow({
          incidentId: incident.id,
          userId: user.id,
          dateFollowed: new Date().toISOString(),
        });
      } else {
        // If follow exists, delete it
        await deleteIncidentFollow(existingFollow.id);
      }

      fetchIncidents();
    } catch (err) {
      console.error("Error al gestionar el like:", err);
    }
  };

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCloseViewMore = () => {
    setViewMoreIncidentId(null);
    const params = new URLSearchParams(location.search);
    params.delete("incidentId");
    navigate({ search: params.toString() }, { replace: true });
  };

  return (
    <>
      <Header transparent={false} />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="pt-40 p-8 pb-20 bg-gray-200"
      >
        <h1
          className="text-3xl md:text-4xl font-poppins font-bold mb-8 text-center"
          style={{ color: "var(--color-neutral-2)" }}
        >
          {t('incidents_title')}
        </h1>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          {!showForm && (
            <Button
              variant="contained"
              color="primary"
              startIcon={isAuthenticated ? <AddIcon /> : null}
              onClick={() => {
                if (isAuthenticated) {
                  setShowForm(true);
                  setFormData(initialFormData);
                  setEditingIncident(null);
                } else {
                  navigate("/register");
                }
              }}
            >
              {isAuthenticated
                ? t('incidents_new')
                : t('incidents_login_to_create')}
            </Button>
          )}
        </div>

        {/* Modal Form */}
        <Dialog
          open={showForm}
          onClose={() => setShowForm(false)}
          maxWidth="md"
          fullWidth
        >
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
          onLike={handleLike}
          onFollow={handleFollow}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
          viewMoreIncidentId={viewMoreIncidentId}
          handleCloseViewMore={handleCloseViewMore}
        />
      </motion.main>
      <Footer />
    </>
  );
};

export default Incident;
