import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UserMenu = ({ user, isAdmin, onLogout }) => {
  const { t } = useTranslation();
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
  const dashboardLink = isAdmin ? "/dashboard-admin" : "/dashboard-user";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:brightness-90 transition-colors overflow-hidden bg-blue-600"
      >
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt="avatar"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <p className="text-xl">{initial}</p>
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
                {t('profile')}
              </Link>
            </li>
            <li>
              {isAdmin ? (
                <button
                  onClick={() => {
                    window.location.href = `${
                      import.meta.env.VITE_API_URL
                    }/dashboard-admin`;
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg bg-none border-none cursor-pointer"
                >
                  {t('dashboard')}
                </button>
              ) : (
                <Link
                  to={dashboardLink}
                  className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  {t('dashboard')}
                </Link>
              )}
            </li>
            <li>
              <button
                onClick={() => {
                  onLogout();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                {t('logout')}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
