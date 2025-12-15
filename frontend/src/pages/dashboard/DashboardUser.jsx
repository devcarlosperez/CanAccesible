import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import useAuthStore from "../../services/authService";
import { getMyIncidents } from "../../services/incidentService";
import { getAllNotifications } from "../../services/notificationService";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DashboardUser = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    published: 0,
    inProgress: 0,
    resolved: 0,
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
        };

        incidentsData.forEach((inc) => {
          // Assuming status IDs: 1=Pending, 2=In Progress, 3=Resolved
          // And assuming "Published" means Approved
          if (inc.incidentStatusId === 1) newStats.pending++;
          if (inc.incidentStatusId === 2) newStats.inProgress++;
          if (inc.incidentStatusId === 3) newStats.resolved++;
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-8">
            <StatCard
              title={t('dashboard_pending')}
              count={stats.pending}
              color="text-gray-800"
            />
            <StatCard
              title={t('dashboard_published')}
              count={stats.published}
              color="text-red-700"
            />
            <StatCard
              title={t('dashboard_in_progress')}
              count={stats.inProgress}
              color="text-green-700"
            />
            <StatCard
              title={t('dashboard_resolved')}
              count={stats.resolved}
              color="text-green-800"
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
      </main>

      <Footer />
    </>
  );
};

const StatCard = ({ title, count, color }) => (
  <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between h-32">
    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
      {title}
    </span>
    <div className="flex justify-between items-end">
      <span className="text-4xl font-bold text-gray-800">{count}</span>
      <span className={`text-sm font-bold ${color}`}>+36% ↑</span>
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
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            isRead ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
