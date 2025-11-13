import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/canaccesible-logo-2.png";
import useAuthStore from "../../services/authService.js";
import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";

const Header = ({ transparent = true }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1150);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [open, setOpen] = useState(false);

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
      import("../../services/notificationService").then(
        ({ getAllNotifications }) => {
          getAllNotifications()
            .then((data) => setNotifications(Array.isArray(data) ? data : []))
            .catch(() => setNotifications([]));
        }
      );
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const menuItems = [
    { text: "Inicio", to: "/home", icon: "home" },
    { text: "Incidencias", to: "/incidents", icon: "assignment" },
    { text: "Islas", to: "/islands", icon: "public" },
    { text: "Contacto", to: "/contact", icon: "contact_mail" },
    { text: "Iniciar Sesión", to: "/login", icon: "login", login: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full flex justify-between items-center text-white z-100 transition-all duration-300 ${
        transparent
          ? scrolled
            ? "bg-[#0c0c22]/95 shadow-lg p-4 md:p-5 backdrop-blur-md"
            : "bg-transparent p-4 md:p-8 lg:p-10"
          : "bg-[#0c0c22]/95 shadow-lg p-4 md:p-5 backdrop-blur-md"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={logo}
          alt="Canarias Accesible"
          className={`w-auto transition-all duration-300 ${
            transparent && !scrolled
              ? "h-12 sm:h-14 md:h-15 lg:h-17 xl:h-19"
              : "h-10 sm:h-12 md:h-14 lg:h-16 xl:h-15"
          }`}
        />
      </Link>

      {/* Desktop / Mobile */}
      {!isMobile ? (
        <HeaderDesktop
          menuItems={menuItems}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          setNotifications={setNotifications}
        />
      ) : (
        <HeaderMobile
          open={open}
          setOpen={setOpen}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          setNotifications={setNotifications}
          menuItems={menuItems}
          scrolled={scrolled}
        />
      )}
    </header>
  );
};

export default Header;
