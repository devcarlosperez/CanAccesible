import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/canaccesible-logo.png";
import "./Header.css";

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1150);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch notifications from backend
  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => setNotifications([]));
  }, []);

  // Update notification amount
  const notificationsCount = notifications.length;

  // Delete notification
  const handleDelete = async (id) => {
    const response = await fetch(`/api/notifications/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setNotifications(notifications.filter((n) => n.id !== id));
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1150);
    const handleScroll = () => setScrolled(window.scrollY >= 150);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    <>
      <header
        className={`fixed top-0 left-0 w-full flex justify-between items-center text-white z-100 transition-all duration-300 ${
          scrolled
            ? "bg-[#0c0c22]/95 shadow-lg p-4 md:p-5 backdrop-blur-md"
            : "bg-transparent p-4 md:p-8 lg:p-10"
        }`}
      >
        {/* Logo responsive */}
        <div className="transition-all duration-300">
          <img
            src={logo}
            alt="Canarias Accesible"
            className={`w-auto transition-all duration-300 
              ${
                scrolled
                  ? "h-10 sm:h-12 md:h-14 lg:h-16 xl:h-18"
                  : "h-12 sm:h-14 md:h-15 lg:h-17 xl:h-19"
              }`}
          />
        </div>

        {/* DESKTOP NAVIGATION */}
        {!isMobile && (
          <>
            <nav className="flex items-center">
              <ul
                className="flex list-none 
                  gap-6 sm:gap-8 md:gap-12 lg:gap-14 xl:gap-16 
                  lg:text-lg xl:text-xl
                  font-semibold transition-all duration-300"
              >
                {menuItems.slice(0, 4).map((item) => (
                  <li key={item.text}>
                    <Link
                      to={item.to}
                      className="hover:text-accent-1 transition-colors"
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Desktop notifications + login */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              {/* Notifications */}
              <button
                type="button"
                className="relative text-white hover:text-accent-1 transition-colors focus:outline-none cursor-pointer"
                aria-label="Notificaciones"
                onClick={() => setShowNotifications(true)}
              >
                <span className="material-symbols-outlined text-xl md:text-2xl lg:text-3xl">
                  notifications
                </span>
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationsCount}
                  </span>
                )}
              </button>

              {/* Login Button responsive */}
              <Link
                to="/login"
                className="bg-[#1b226b] text-neutral-1 px-3 py-1.5 sm:px-5 sm:py-2 md:px-7 md:py-2.5 lg:px-9 lg:py-3 xl:px-11 xl:py-3.5
                lg:text-md xl:text-base rounded-xl font-semibold hover:bg-[#162053] hover:scale-105 transition-all duration-200"
              >
                Iniciar Sesión
              </Link>
            </div>
          </>
        )}

        {/* MOBILE BURGER + NOTIFICATIONS */}
        {isMobile && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative text-white hover:text-accent-1 transition-colors focus:outline-none"
              aria-label="Notificaciones"
              onClick={() => setShowNotifications(true)}
            >
              <span className="material-symbols-outlined text-2xl">
                notifications
              </span>
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationsCount}
                </span>
              )}
            </button>

            <span
              className={`material-symbols-outlined menu-icon text-3xl cursor-pointer z-101 transition-colors duration-300 ${
                scrolled ? "text-amber-50" : "text-neutral-2"
              }`}
              onClick={() => setOpen(true)}
            >
              menu
            </span>
          </div>
        )}
      </header>

      {/* MOBILE OVERLAY */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black/50 z-110 transition-opacity duration-300 ${
            open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* MOBILE SIDE MENU */}
      {isMobile && (
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-[#1b226b] z-120 transform transition-transform duration-300 shadow-2xl ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-6">
            <span
              className="material-symbols-outlined text-white text-3xl cursor-pointer"
              onClick={() => setOpen(false)}
            >
              close
            </span>
          </div>

          <ul className="flex flex-col p-4 gap-4">
            {menuItems.map((item) => (
              <li key={item.text}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-xl font-semibold transition duration-200 ${
                    item.login
                      ? "bg-white text-[#1b226b] hover:bg-gray-200"
                      : "text-white hover:text-[#92B2EA]"
                  }`}
                >
                  <span className="material-symbols-outlined mr-3">
                    {item.icon}
                  </span>
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notification window */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/40 z-200 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setShowNotifications(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-lg font-bold mb-4 text-[#1b226b]">
              Notificaciones
            </h2>
            {notifications.length === 0 ? (
              <p className="text-gray-500">No tienes notificaciones.</p>
            ) : (
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="flex justify-between items-center bg-gray-100 rounded-lg px-3 py-2"
                  >
                    <span>{n.message}</span>
                    <button
                      className="text-red-500 hover:text-red-700 ml-4"
                      onClick={() => handleDelete(n.id)}
                      title="Borrar notificación"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
