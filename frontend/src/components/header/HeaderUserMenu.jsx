import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const UserMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarSrc = user?.nameFile || null;
  const initial = user?.firstName?.[0]?.toUpperCase() || "U";
  const userRole = typeof user?.role === "string" ? user.role : user?.role?.role;
  const isAdmin = userRole === "admin";
  const dashboardLink = isAdmin ? "/dashboard-admin" : "/dashboard-user";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-13 h-13 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:brightness-90 transition-colors overflow-hidden"
      >
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt="avatar"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50 border border-gray-200">
          <ul className="flex flex-col p-2 text-black">
            <li>
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setOpen(false)}
              >
                Perfil
              </Link>
            </li>
            <li>
              {isAdmin ? (
                <button
                  onClick={() => {
                    window.location.href = `${import.meta.env.VITE_API_URL}/dashboard-admin`;
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg bg-none border-none cursor-pointer"
                >
                  Dashboard
                </button>
              ) : (
                <Link
                  to={dashboardLink}
                  className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </li>
            <li>
              <button
                onClick={() => {
                  onLogout();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
