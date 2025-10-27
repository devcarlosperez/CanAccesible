import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/canaccesible-logo.png";
import "./Header.css";

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [open, setOpen] = useState(false);

  // Handle window resize to toggle mobile/desktop view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Menu items configuration
  const menuItems = [
    { text: "Inicio", to: "/home", icon: "home" },
    { text: "Incidencias", to: "/", icon: "assignment" },
    { text: "Islas", to: "/lugares", icon: "public" },
    { text: "Contacto", to: "/contacto", icon: "contact_mail" },
    { text: "Iniciar Sesión", to: "/login", icon: "login", login: true },
  ];

  return (
    <header className="flex justify-between items-center text-white p-7 md:p-12 m-2 relative">
      {/* Logo */}
      <div>
        <img
          src={logo}
          alt="Canarias Accesible"
          className="h-14 md:h-19 w-auto"
        />
      </div>

      {/* Desktop navigation */}
      {!isMobile && (
        <nav className="flex items-center p-4">
          <ul className="flex list-none text-xl gap-19">
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
      )}

      {/* Desktop login button */}
      {!isMobile && (
        <Link
          to="/login"
          className="bg-[#1b226b] text-neutral-1 px-8 py-3 text-xl rounded-xl font-semibold 
                     hover:bg-[#162053] hover:scale-105 transition duration-200"
        >
          Iniciar Sesión
        </Link>
      )}

      {/* Mobile menu */}
      {isMobile && (
        <>
          <span
            className="material-symbols-outlined menu-icon text-neutral-2 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            menu
          </span>

          {/* Drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-72 bg-neutral-3 z-50 transform transition-transform duration-300 ${
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
                    onClick={() => setOpen(false)}
                    className={`flex items-center px-4 py-2 rounded-xl font-semibold transition duration-200 transform ${
                      item.login
                        ? "bg-[#1b226b] text-neutral-1 hover:bg-[#162053] hover:scale-102"
                        : "text-white hover:text-[#1b226b]"
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

          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setOpen(false)}
          ></div>
        </>
      )}
    </header>
  );
};

export default Header;
