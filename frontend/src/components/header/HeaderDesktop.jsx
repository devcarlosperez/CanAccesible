import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuthStore from "../../services/authService.js";
import NotificationDropdown from "./NotificationDropdown.jsx";
import UserMenu from "./HeaderUserMenu.jsx";
import LanguageSwitcher from "../utils/LanguageSwitcher.jsx";
import logo from "../../assets/canaccesible-logo-2.webp";

const HeaderDesktop = ({
  menuItems,
  notifications,
  showNotifications,
  setShowNotifications,
  handleDeleteNotification,
  transparent,
  scrolled,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated, user, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const notificationsCount = notifications.length;

  const handleLogout = () => {
    navigate("/home");
    logout();
  };

  return (
    <div className="flex items-center w-full">
      <Link to="/">
        <img
          src={logo}
          alt="Canarias Accesible"
          className={`w-auto transition-all duration-300 ${
            transparent && !scrolled
              ? "h-12 sm:h-14 md:h-15 lg:h-17 xl:h-18"
              : "h-10 sm:h-12 md:h-14 lg:h-16 xl:h-15"
          }`}
        />
      </Link>

      <nav className="flex-1 flex justify-center">
        <ul className="flex list-none gap-6 sm:gap-8 md:gap-12 lg:gap-14 xl:gap-16 font-semibold">
          {menuItems.slice(0, 5).map((item) => (
            <li key={item.text}>
              <Link
                to={item.to}
                className="hover:text-blue-700 transition-colors"
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
        <LanguageSwitcher />
        {isAuthenticated && (
          <NotificationDropdown
            notificationsCount={notificationsCount}
            notifications={notifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            handleDeleteNotification={handleDeleteNotification}
            iconSize="text-xl md:text-2xl lg:text-3xl"
            dropdownWidth="w-80"
          />
        )}

        {isAuthenticated ? (
          <UserMenu user={user} isAdmin={isAdmin} onLogout={handleLogout} />
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 text-neutral-1 px-3 py-1.5 sm:px-5 sm:py-2 md:px-7 md:py-2.5 lg:px-9 lg:py-3 xl:px-11 xl:py-3.5 lg:text-md xl:text-base rounded-xl font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-200"
          >
            {t('login')}
          </Link>
        )}
      </div>
    </div>
  );
};

export default HeaderDesktop;
