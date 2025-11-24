import { Link } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown.jsx";
import MobileMenu from "./HeaderMobileMenu.jsx";
import useAuthStore from "../../services/authService.js";
import logo from "../../assets/canaccesible-logo-2.png";
import "./Header.css";

const HeaderMobile = ({
  open,
  setOpen,
  notifications,
  showNotifications,
  setShowNotifications,
  setNotifications,
  menuItems,
  scrolled,
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const notificationsCount = notifications.length;

  return (
    <>
      <div className="flex items-center justify-between w-full px-1">
        <Link to="/">
          <img
            src={logo}
            alt="Canarias Accesible"
            className="w-auto h-11 sm:h-14 md:h-15 transition-all duration-300"
          />
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <NotificationDropdown
              notificationsCount={notificationsCount}
              notifications={notifications}
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
              handleDelete={(id) =>
                setNotifications((prev) => prev.filter((n) => n.id !== id))
              }
              iconSize="text-2xl"
              dropdownWidth="w-72"
            />
          )}

          <span
            className={`material-symbols-outlined menu-icon text-3xl cursor-pointer z-101 transition-colors duration-300 ${
              scrolled ? "text-amber-50" : "text-amber-50"
            }`}
            onClick={() => setOpen(true)}
          >
            menu
          </span>
        </div>
      </div>

      <MobileMenu
        open={open}
        setOpen={setOpen}
        menuItems={menuItems}
        isAuthenticated={isAuthenticated}
        user={user}
      />
    </>
  );
};

export default HeaderMobile;
