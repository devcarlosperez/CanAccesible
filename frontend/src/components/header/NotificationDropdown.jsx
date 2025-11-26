const NotificationDropdown = ({
  notificationsCount,
  notifications,
  showNotifications,
  setShowNotifications,
  handleDeleteNotification,
  iconSize = "text-xl md:text-2xl lg:text-3xl",
  dropdownWidth = "w-80",
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return "";
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="relative text-white hover:text-accent-1 transition-colors focus:outline-none cursor-pointer mt-2"
        aria-label="Notificaciones"
        onClick={() => setShowNotifications((prev) => !prev)}
      >
        <span className={`material-symbols-outlined ${iconSize}`}>
          notifications
        </span>
        {notificationsCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notificationsCount}
          </span>
        )}
      </button>
      {showNotifications && (
        <div
          className={`absolute right-0 mt-2 ${dropdownWidth} bg-white rounded-xl shadow-xl z-200 border border-gray-200`}
        >
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <span className="text-lg font-bold text-[#1b226b]">
              Notificaciones
            </span>
          </div>
          <div className="p-4 max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500">No tienes notificaciones.</p>
            ) : (
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="flex justify-between items-start bg-gray-100 rounded-lg px-3 py-2 gap-2"
                  >
                    <div className="flex-1">
                      <p className="text-black text-sm">{n.message}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {formatDate(n.dateNotification)}
                      </p>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 shrink-0"
                      onClick={() => handleDeleteNotification(n.id)}
                      title="Borrar notificación"
                    >
                      <span className="material-symbols-outlined text-lg">
                        delete
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
