import { Link } from "react-router-dom";
import useAuthStore from "../../services/authService.js";
import NotificationDropdown from "./NotificationDropdown.jsx";
import UserMenu from "./HeaderUserMenu.jsx";
import NavLinks from "./HeaderNavLinks.jsx";

const HeaderDesktop = ({
  menuItems,
  notifications,
  showNotifications,
  setShowNotifications,
  setNotifications,
}) => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const notificationsCount = notifications.length;

  return (
    <div className="flex items-center gap-6">
      {/* Navegación */}
      <nav>
        <NavLinks menuItems={menuItems.slice(0, 4)} showIcons={false} />
      </nav>

      {/* Notificaciones + Login / Avatar */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
        {isAuthenticated && (
          <NotificationDropdown
            notificationsCount={notificationsCount}
            notifications={notifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            handleDelete={(id) =>
              setNotifications((prev) => prev.filter((n) => n.id !== id))
            }
            iconSize="text-xl md:text-2xl lg:text-3xl"
            dropdownWidth="w-80"
          />
        )}

        {isAuthenticated ? (
          <UserMenu user={user} onLogout={logout} />
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 text-neutral-1 px-3 py-1.5 sm:px-5 sm:py-2 md:px-7 md:py-2.5 lg:px-9 lg:py-3 xl:px-11 xl:py-3.5 lg:text-md xl:text-base rounded-xl font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-200"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </div>
  );
};

export default HeaderDesktop;
