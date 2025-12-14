import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useAuthStore from "../../services/authService.js";
import {
  getAllNotifications,
  deleteNotification,
} from "../../services/notificationService";
import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";

const Header = ({ transparent = true }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1150);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1150);
    const handleScroll = () =>
      transparent && setScrolled(window.scrollY >= 150);

    window.addEventListener("resize", handleResize);
    if (transparent) window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (transparent) window.removeEventListener("scroll", handleScroll);
    };
  }, [transparent]);

  useEffect(() => {
    if (isAuthenticated) {
      getAllNotifications()
        .then((data) => {
          const notificationsArray = Array.isArray(data) ? data : [];
          setNotifications(notificationsArray);
        })
        .catch(() => setNotifications([]));
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated]);

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      const updatedNotifications = notifications.filter((n) => n.id !== id);
      setNotifications(updatedNotifications);
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const menuItems = [
    { text: t('home'), to: "/home", icon: "home" },
    { text: t('incidents'), to: "/incidents", icon: "assignment" },
    { text: t('map'), to: "/map", icon: "map" },
    { text: t('blog'), to: "/blog", icon: "article" },
    { text: t('contact'), to: "/contact", icon: "contact_mail" },
    { text: t('login'), to: "/login", icon: "login", login: true },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.login && isAuthenticated) return false;
    return true;
  });

  return (
    <header
      className={`fixed top-0 left-0 w-full flex justify-between items-center text-white z-100 transition-all duration-300 ${
        transparent
          ? scrolled
            ? "bg-[#0c0c22] shadow-lg p-4 md:p-5"
            : "bg-transparent p-4 md:p-8 lg:p-10"
          : "bg-[#0c0c22] shadow-lg p-4 md:p-5"
      }`}
    >
      {/* Desktop / Mobile */}
      {!isMobile ? (
        <HeaderDesktop
          menuItems={menuItems}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          handleDeleteNotification={handleDeleteNotification}
          transparent={transparent}
          scrolled={scrolled}
        />
      ) : (
        <HeaderMobile
          open={open}
          setOpen={setOpen}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          handleDeleteNotification={handleDeleteNotification}
          menuItems={filteredMenuItems}
          scrolled={scrolled}
        />
      )}
    </header>
  );
};

export default Header;
