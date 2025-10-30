import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/canaccesible-logo.png";
import "./Header.css";

const Header = () => {
  // State to check if viewport is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // State to toggle mobile menu open/close
  const [open, setOpen] = useState(false);

  // State to detect if page has been scrolled past threshold
  const [scrolled, setScrolled] = useState(false);

  // State for notification amount
  const [notificationsCount, setNotificationsCount] = useState(2);

  // Effect to handle resize and scroll events
  useEffect(() => {
    // Update isMobile on window resize
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    // Update scrolled when user scrolls past 150px
    const handleScroll = () => setScrolled(window.scrollY >= 150);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Effect to prevent background scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const menuItems = [
    { text: "Inicio", to: "/home", icon: "home" },
    { text: "Incidencias", to: "/", icon: "assignment" },
    { text: "Islas", to: "/lugares", icon: "public" },
    { text: "Contacto", to: "/contacto", icon: "contact_mail" },
    // { text: "Notificaciones", icon: "notifications" },
    { text: "Iniciar Sesión", to: "/login", icon: "login", login: true },
  ];

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 w-full flex justify-between items-center text-white z-100 transition-all duration-300 ${
          scrolled
            ? "bg-[#0c0c22]/95 shadow-lg p-5 md:p-5 backdrop-blur-md"
            : "bg-transparent p-4.5 md:p-10"
        }`}
      >
        {/* Logo */}
        <div className="transition-all duration-300">
          <img
            src={logo}
            alt="Canarias Accesible"
            className={`w-auto transition-all duration-300 ${
              scrolled ? "h-11 md:h-14" : "h-14 md:h-18"
            }`}
          />
        </div>

        {/* DESKTOP NAVIGATION */}
        {!isMobile && (
          <>
            <nav className="flex items-center">
              <ul className="flex list-none text-lg md:text-xl gap-12 md:gap-16">
                {menuItems.slice(0, 4).map((item) => (
                  <li key={item.text}>
                    <Link
                      to={item.to}
                      className="font-semibold hover:text-accent-1 transition-colors"
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Desktop notifications + login button */}
            <div className="flex items-center gap-4">
              {/* Desktop notification button */}
              <button
                type="button"
                className="relative text-white hover:text-accent-1 transition-colors focus:outline-none"
                aria-label="Notificaciones"
              >
                <span className="material-symbols-outlined">notifications</span>
                {/* Notification amount */}
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationsCount}
                  </span>
                )}
              </button>

              {/* Desktop login button */}
              <Link
                to="/login"
                className="bg-[#1b226b] text-neutral-1 px-6 py-2 md:px-8 md:py-3 text-lg md:text-xl rounded-xl font-semibold 
                           hover:bg-[#162053] hover:scale-105 transition duration-200"
              >
                Iniciar Sesión
              </Link>
            </div>
          </>
        )}

        {/* MOBILE BURGER AND NOTIFICATION ICONS */}
        {isMobile && (
          <div className="flex items-center gap-4">
            {/* Mobile notification button */}
            <button
              type="button"
              className="relative text-white hover:text-accent-1 transition-colors focus:outline-none"
              aria-label="Notificaciones"
            >
              <span className="material-symbols-outlined">notifications</span>
              {/* Notification amount */}
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationsCount}
                </span>
              )}
            </button>

            {/* Mobile burger icon */}
            <span
              className={`material-symbols-outlined menu-icon cursor-pointer z-101 transition-colors duration-300 ${
                scrolled ? "text-amber-50" : "text-neutral-2"
              }`}
              onClick={() => setOpen(true)}
            >
              menu
            </span>
          </div>
        )}
      </header>

      {/* MOBILE MENU OVERLAY */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black/50 z-110 transition-opacity duration-300 ${
            open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setOpen(false)} // Close menu when clicking outside
        ></div>
      )}

      {/* MOBILE SIDE MENU */}
      {isMobile && (
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-[#1b226b] z-120 transform transition-transform duration-300 shadow-2xl ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close icon */}
          <div className="flex justify-end p-6">
            <span
              className="material-symbols-outlined menu-icon text-white cursor-pointer"
              onClick={() => setOpen(false)}
            >
              close
            </span>
          </div>

          {/* Mobile menu items */}
          <ul className="flex flex-col p-4 gap-4">
            {menuItems.map((item) => (
              <li key={item.text}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)} // Close menu when clicking an item
                  className={`flex items-center px-4 py-2 rounded-xl font-semibold transition duration-200 transform ${
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
    </>
  );
};

export default Header;
