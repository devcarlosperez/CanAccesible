import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import IncidentCommentSection from "../../components/incidents/IncidentCommentSection";

import { getIncidentById } from "../../services/incidentService";
import { getAllIncidentLikes } from "../../services/incidentLikesService";
import useAuthStore from "../../services/authService.js";
import { initSocket } from "../../services/socketService";

import { Chip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const IncidentDetail = () => {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const { user, token } = useAuthStore();

  useEffect(() => {
    const socket = initSocket(token);

    if (socket && id) {
      socket.emit("joinIncident", id);

      const handleLikesUpdate = (data) => {
        if (parseInt(data.incidentId) === parseInt(id)) {
          setLikeCount(data.count);
        }
      };

      socket.on("incident:likes_update", handleLikesUpdate);

      return () => {
        socket.emit("leaveIncident", id);
        socket.off("incident:likes_update", handleLikesUpdate);
      };
    }
  }, [id, token]);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const data = await getIncidentById(id);

        if (!data.isApproved) {
          setError(
            "Esta incidencia no está disponible o está pendiente de aprobación."
          );
          return;
        }

        setIncident(data);

        const likes = await getAllIncidentLikes();
        const incidentLikes = likes.filter(
          (like) => like.incidentId === parseInt(id)
        );
        setLikeCount(incidentLikes.length);
      } catch (err) {
        console.error("Error al cargar la incidencia:", err);
        setError("No se pudo cargar la incidencia.");
      }
    };

    fetchIncident();
  }, [id, user]);

  if (error || !incident) {
    return (
      <>
        <Header transparent={false} />
        <main className="min-h-screen bg-gray-200 pt-40 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              to="/incidents"
              className="inline-flex items-center gap-2 transition-colors mb-8 font-roboto font-medium text-blue-600 hover:text-blue-800"
            >
              <i className="fas fa-arrow-left"></i>
              Volver a Incidencias
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || "Cargando incidencia..."}
            </h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const getStatusLabel = (statusId) => {
    switch (statusId) {
      case 1:
        return "Pendiente";
      case 2:
        return "En progreso";
      case 3:
        return "Resuelto";
      default:
        return "Desconocido";
    }
  };

  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 1:
        return "warning";
      case 2:
        return "info";
      case 3:
        return "success";
      default:
        return "default";
    }
  };

  return (
    <>
      <Header transparent={false} />
      <main className="min-h-screen bg-gray-200 pt-40 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/incidents"
            className="inline-flex items-center gap-2 transition-colors mb-6 font-roboto font-medium text-blue-600 hover:text-blue-800"
          >
            <i className="fas fa-arrow-left"></i>
            Volver a Incidencias
          </Link>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {incident.name}
                </h1>
                <Chip
                  label={getStatusLabel(incident.incidentStatusId)}
                  color={getStatusColor(incident.incidentStatusId)}
                  variant="filled"
                />
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <i className="fas fa-calendar-alt"></i>
                  {new Date(incident.dateIncident).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <i className="fas fa-map-marker-alt"></i>
                  {incident.island || "Isla no especificada"}
                </span>
                <span className="flex items-center gap-1">
                  <i className="fas fa-tag"></i>
                  {incident.area}
                </span>
              </div>
            </div>

            {/* Image */}
            {incident.nameFile && (
              <div className="w-full h-64 md:h-96 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={incident.nameFile}
                  alt={incident.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Descripción
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {incident.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="block text-sm font-medium text-gray-500 mb-1">
                    Tipo de Incidencia
                  </span>
                  <span className="text-gray-800 font-medium">
                    {incident.incidentTypeId === 1
                      ? "Buena Práctica"
                      : "Mala Práctica"}
                  </span>
                </div>

                {incident.incidentTypeId === 2 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="block text-sm font-medium text-gray-500 mb-1">
                      Severidad
                    </span>
                    <span className="text-gray-800 font-medium">
                      {incident.incidentSeverityId === 1
                        ? "Baja"
                        : incident.incidentSeverityId === 2
                        ? "Media"
                        : "Alta"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-8 text-gray-600">
                <FavoriteIcon sx={{ color: "red" }} />
                <span className="font-medium">{likeCount} likes</span>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <IncidentCommentSection incidentId={incident.id} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default IncidentDetail;
