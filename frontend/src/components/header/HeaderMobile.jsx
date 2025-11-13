import NotificationDropdown from "./NotificationDropdown.jsx";
import MobileMenu from "./HeaderMobileMenu.jsx";
import useAuthStore from "../../services/authService.js";
import UserMenu from "./HeaderUserMenu.jsx";

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
  const { isAuthenticated, user, logout } = useAuthStore();
  const notificationsCount = notifications.length;

  return (
    <>
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

        {isAuthenticated ? (
          <UserMenu user={user} onLogout={logout} />
        ) : (
          <span
            className={`material-symbols-outlined menu-icon text-3xl cursor-pointer z-101 transition-colors duration-300 ${
              scrolled ? "text-amber-50" : "text-amber-50"
            }`}
            onClick={() => setOpen(true)}
          >
            menu
          </span>
        )}
      </div>

      {/* Mobile side menu */}
      <MobileMenu open={open} setOpen={setOpen} menuItems={menuItems} />
    </>
  );
};

export default HeaderMobile;
