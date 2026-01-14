import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import useAuthStore from "../../services/authService";
import { getMyIncidents } from "../../services/incidentService";
import { getAllNotifications } from "../../services/notificationService";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Chip, Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

const DashboardUser = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [modalCategory, setModalCategory] = useState(null);

  const [stats, setStats] = useState({
    pending: 0,
    published: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [incidentsData, notificationsData] = await Promise.all([
          getMyIncidents(),
          getAllNotifications(),
        ]);

        setIncidents(incidentsData);
        setNotifications(notificationsData);

        // Calculate stats
        const newStats = {
          pending: 0,
          published: 0,
          inProgress: 0,
          resolved: 0,
          rejected: 0,
        };

        incidentsData.forEach((inc) => {
          if (inc.incidentStatusId === 1) newStats.pending++;
          if (inc.incidentStatusId === 2) newStats.inProgress++;
          if (inc.incidentStatusId === 3) newStats.resolved++;
          if (!inc.isApproved) newStats.rejected++;
          if (inc.isApproved) newStats.published++;
        });

        setStats(newStats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  const handleOpenModal = (category) => {
    setModalCategory(category);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalCategory(null);
  };

  const getFilteredIncidents = () => {
    if (!modalCategory) return [];
    return incidents.filter((inc) => {
      // Logic matching the stats calculation above
      if (modalCategory === 'published') return inc.isApproved;
      if (modalCategory === 'rejected') return !inc.isApproved;
      return false;
    });
  };

  const getStatusChipProps = (statusId) => {
    switch (statusId) {
      case 1: return { label: t('incident_status_pending', 'Pendiente'), color: "warning" };
      case 2: return { label: t('incident_status_in_progress', 'En Progreso'), color: "info" };
      case 3: return { label: t('incident_status_resolved', 'Resuelta'), color: "success" };
      default: return { label: t('incident_status_pending'), color: "default" };
    }
  };

  const getModalTitle = () => {
    switch (modalCategory) {
      case 'published': return t('dashboard_published');
      case 'rejected': return t('dashboard_pending_approval', 'Incidencias pendientes por aprobar');
      default: return t('incidents');
    }
  };

  // Get top 5 most liked incidents
  const topLikedIncidents = [...incidents]
    .sort((a, b) => b.likesCount - a.likesCount)
    .slice(0, 5);

  const maxLikes =
    topLikedIncidents.length > 0 ? topLikedIncidents[0].likesCount : 1;

  // Filter notifications for last 7 days
  const recentNotifications = notifications.filter((n) => {
    const date = new Date(n.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return date >= sevenDaysAgo;
  });

  if (loading) {
    return (
      <>
        <Header transparent={false} />
        <div className="flex justify-center items-center min-h-screen pt-32 bg-gray-200">
          <p className="text-xl font-semibold text-gray-600">{t('loading')}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header transparent={false} />

      <main className="bg-gray-200 min-h-screen pt-32 px-4 md:px-8 lg:px-16 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">
            {t('dashboard_hello', { name: user?.firstName })}{" "}
            <span className="text-gray-500 font-normal">
              {t('dashboard_subtitle')}
            </span>
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 mt-8">
            <StatCard
              title={t('dashboard_published')}
              count={stats.published}
              color="text-green-700"
              onOpen={() => handleOpenModal('published')}
              btnText={t('view_details', 'Ver detalles')}
            />
            <StatCard
              title={t('dashboard_pending_approval', 'Incidencias pendientes por aprobar')}
              count={stats.rejected}
              color="text-gray-800"
              onOpen={() => handleOpenModal('rejected')}
              btnText={t('view_details', 'Ver detalles')}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Notifications Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800">
                {t('dashboard_notifications')}
              </h2>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notif) => (
                    <NotificationItem key={notif.id} notification={notif} t={t} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    {t('dashboard_no_notifications')}
                  </p>
                )}
              </div>
            </div>

            {/* Most Supported Incidents Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {t('dashboard_most_supported')}
                </h2>
              </div>

              <div className="space-y-6">
                {topLikedIncidents.length > 0 ? (
                  topLikedIncidents.map((inc) => (
                    <LikabilityBar
                      key={inc.id}
                      incident={inc}
                      maxLikes={maxLikes}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    {t('dashboard_no_likes')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Incidents List */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {getModalTitle()}
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {getFilteredIncidents().length > 0 ? (
                getFilteredIncidents().map((incident) => (
                  <ListItem
                    key={incident.id}
                    disablePadding
                    sx={{
                      py: 2,
                      px: 2,
                      borderBottom: '1px solid #eee',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 2,
                      display: 'flex',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      {incident.nameFile && (
                        <img
                          src={incident.nameFile}
                          alt={incident.name}
                          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <ListItemText
                          primary={incident.name}
                          secondary={
                            <>
                              <span className="block text-sm text-gray-500 flex items-center gap-2">
                                {new Date(incident.dateIncident).toLocaleDateString()} - {incident.island}
                                <Chip 
                                  label={getStatusChipProps(incident.incidentStatusId).label} 
                                  color={getStatusChipProps(incident.incidentStatusId).color} 
                                  size="small" 
                                  sx={{ height: 20, fontSize: '0.7rem' }} 
                                />
                              </span>
                              <span className="block text-xs text-gray-400 mt-1 line-clamp-2">
                                {incident.description}
                              </span>
                            </>
                          }
                          sx={{ m: 0 }}
                        />
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-auto mt-2 sm:mt-0">
                      {modalCategory !== 'rejected' && (
                       <Button 
                         variant="outlined" 
                         size="small" 
                         startIcon={<VisibilityIcon />}
                         onClick={() => navigate(`/incidents/${incident.id}`)}
                       >
                         {t('view_details', 'Ver')}
                       </Button>
                      )}
                    </div>
                  </ListItem>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  {t('no_incidents_in_category', 'No hay incidencias en esta categoría')}
                </p>
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              {t('close', 'Cerrar')}
            </Button>
          </DialogActions>
        </Dialog>
      </main>

      <Footer />
    </>
  );
};

const StatCard = ({ title, count, color, onOpen, btnText }) => (
  <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between h-32">
    <div className="flex justify-between items-start w-full">
      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
        {title}
      </span>
      {onOpen && (
        <button
          onClick={onOpen}
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
        >
          {btnText}
        </button>
      )}
    </div>
    <div className="flex justify-between items-end">
      <span className="text-4xl font-bold text-gray-800">{count}</span>
    </div>
  </div>
);

const NotificationItem = ({ notification, t }) => {
  const date = new Date(notification.createdAt).toLocaleDateString();
  // Simple logic to determine "read" status style based on message content or random for demo
  // In a real app, we'd have a 'read' field in the DB
  const isRead = true;

  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${isRead ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
        >
          {isRead ? t('dashboard_read') : t('dashboard_unread')}
        </span>
        <span className="font-semibold text-gray-800 truncate max-w-[200px] md:max-w-[300px]">
          {notification.message}
        </span>
      </div>
      <div className="flex items-center gap-8">
        <span className="text-gray-500 text-sm">{date}</span>
        <button className="text-gray-400 hover:text-gray-600">•••</button>
      </div>
    </div>
  );
};

const LikabilityBar = ({ incident, maxLikes }) => {
  const navigate = useNavigate();
  // Calculate width percentage relative to the max likes in the list
  const width = maxLikes > 0 ? (incident.likesCount / maxLikes) * 100 : 0;

  const handleClick = () => {
    navigate(`/incidents?incidentId=${incident.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer hover:opacity-80 transition-opacity"
    >
      <div className="flex justify-between mb-2">
        <span className="font-medium text-gray-700">{incident.name}</span>
        <div className="flex items-center gap-1">
          <span className="font-bold text-gray-800">{incident.likesCount}</span>
          <span className="text-black">♥</span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DashboardUser;
