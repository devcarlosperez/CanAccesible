import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import IncidentCommentSection from "../../components/incidents/IncidentCommentSection";

import { getIncidentById } from "../../services/incidentService";
import { getAllIncidentLikes } from "../../services/incidentLikesService";
import useAuthStore from "../../services/authService.js";
import { initSocket } from "../../services/socketService";
import { translateText } from "../../services/translationService";
import { useIncidentTranslationStore } from "../../stores/incidentTranslationStore";

import { Chip, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getIncidentStatusLabel } from "../../utils/incidentHelpers";

const IncidentDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const incidentId = parseInt(id);
  const [incident, setIncident] = useState(null);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const { user, token } = useAuthStore();

  // Translation Store
  const { 
    isTranslated: getIsTranslated, 
    getTranslation, 
    setTranslatedText, 
    toggleTranslationStatus 
  } = useIncidentTranslationStore();

  const isTranslated = getIsTranslated(incidentId);
  const cachedTranslation = getTranslation(incidentId);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);

  useEffect(() => {
    const performTranslation = async () => {
      if (isTranslated && incident && (!cachedTranslation?.description || !cachedTranslation?.area)) {
        setIsLoadingTranslation(true);
        try {
          const title = cachedTranslation?.title || await translateText(incident.name);
          const description = cachedTranslation?.description || await translateText(incident.description);
          const area = cachedTranslation?.area || await translateText(incident.area);
          
          setTranslatedText(incidentId, { title, description, area });
        } catch (err) {
          console.error('Translation failed in detail view', err);
        } finally {
          setIsLoadingTranslation(false);
        }
      }
    };

    performTranslation();
  }, [isTranslated, incident, cachedTranslation, incidentId, setTranslatedText]);

  const handleTranslateToggle = () => {
    toggleTranslationStatus(incidentId);
  };

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
          setError(t('incident_not_available'));
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
        setError(t('incident_load_error'));
      }
    };

    fetchIncident();
  }, [id, user]);

  if (error || !incident) {
    return (
      <>
        <Header transparent={false} />
        <main className="min-h-screen bg-gray-100 pt-40 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              to="/incidents"
              className="inline-flex items-center gap-2 transition-colors mb-8 font-roboto font-medium text-blue-800 hover:text-blue-900"
            >
              <i className="fas fa-arrow-left"></i>
              {t('incident_back')}
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || t('incident_loading')}
            </h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const statusLabel = t(getIncidentStatusLabel(incident.incidentStatusId));

  const getIncidentTypeLabel = (typeId) => {
    if (i18n.language === 'en') {
      return typeId === 1 ? "Good Practice" : "Bad Practice";
    }
    return typeId === 1 ? "Buena Práctica" : "Mala Práctica";
  };

  const getSeverityLabel = (severityId) => {
    if (i18n.language === 'en') {
      return severityId === 1 ? "Low" : severityId === 2 ? "Medium" : "High";
    }
    return severityId === 1 ? "Baja" : severityId === 2 ? "Media" : "Alta";
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
      <main className="min-h-screen bg-gray-100 pt-40 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/incidents"
            className="inline-flex items-center gap-2 transition-colors mb-6 font-roboto font-medium text-blue-800 hover:text-blue-900"
          >
            <i className="fas fa-arrow-left"></i>
            {t('incident_back')}
          </Link>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {isTranslated && cachedTranslation?.title ? cachedTranslation.title : incident.name}
                  </h1>
                  <button 
                    onClick={handleTranslateToggle} 
                    disabled={isLoadingTranslation}
                    className={`text-xs px-2 py-1 rounded transition-colors cursor-pointer ${
                      isTranslated 
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                    title={isTranslated ? t('incident_view_original') : t('incident_translate_to_english')}
                  >
                    {isLoadingTranslation ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      isTranslated ? 'EN' : 'ES'
                    )}
                  </button>
                </div>
                <Chip
                  label={statusLabel}
                  color={getStatusColor(incident.incidentStatusId)}
                  variant="filled"
                />
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <i className="fas fa-calendar-alt"></i>
                  {new Date(incident.dateIncident).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'es-ES')}
                </span>
                <span className="flex items-center gap-1">
                  <i className="fas fa-map-marker-alt"></i>
                  {incident.island || (i18n.language === 'en' ? "Unspecified Island" : "Isla no especificada")}
                </span>
                <span className="flex items-center gap-1">
                  <i className="fas fa-tag"></i>
                  {isTranslated && cachedTranslation?.area ? cachedTranslation.area : incident.area}
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
                  {t('incident_description')}
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {isTranslated && cachedTranslation?.description ? cachedTranslation.description : incident.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="block text-sm font-medium text-gray-500 mb-1">
                    {t('incident_type')}
                  </span>
                  <span className="text-gray-800 font-medium">
                    {getIncidentTypeLabel(incident.incidentTypeId)}
                  </span>
                </div>

                {incident.incidentTypeId === 2 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="block text-sm font-medium text-gray-500 mb-1">
                      {t('incident_severity')}
                    </span>
                    <span className="text-gray-800 font-medium">
                      {getSeverityLabel(incident.incidentSeverityId)}
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
