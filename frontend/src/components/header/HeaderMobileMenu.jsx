import { useState } from "react";
import { Link } from "react-router-dom";
import { Transition } from "@headlessui/react";

const MobileMenu = ({
  open,
  setOpen,
  menuItems,
  isAuthenticated,
  user,
  isAdmin,
  onLogout,
}) => {
  const [accountOpen, setAccountOpen] = useState(false);
  const dashboardLink = isAdmin ? "/dashboard-admin" : "/dashboard-user";

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-110 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      ></div>

      {/* Sidebar Menu */}
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

          {isAuthenticated && user && (
            <li>
              {/* Mi cuenta button */}
              <button
                onClick={() => setAccountOpen((prev) => !prev)}
                className="flex items-center w-full px-4 py-2 rounded-xl font-semibold text-white cursor-pointer bg-blue-700 hover:bg-blue-600 transition duration-200"
              >
                <span className="w-9 h-9 rounded-full flex items-center justify-center mr-3 overflow-hidden bg-white">
                  {user.nameFile ? (
                    <img
                      src={user.nameFile}
                      alt="avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-blue-600 font-bold text-md">
                      {user.firstName?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </span>
                Mi cuenta
                <span className="material-symbols-outlined ml-auto">
                  {accountOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              {/* Submenu animado */}
              <Transition
                show={accountOpen}
                enter="transition duration-300 ease-out"
                enterFrom="transform scale-95 opacity-0 -translate-y-2"
                enterTo="transform scale-100 opacity-100 translate-y-0"
                leave="transition duration-200 ease-in"
                leaveFrom="transform scale-100 opacity-100 translate-y-0"
                leaveTo="transform scale-95 opacity-0 -translate-y-2"
              >
                <div className="bg-[#1a1f5a] rounded-xl mt-2 py-2 pl-12 pr-4 shadow-md">
                  <ul className="flex flex-col gap-2">
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setOpen(false)}
                        className="text-white hover:text-[#92B2EA] cursor-pointer"
                      >
                        Perfil
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
                          className="text-white hover:text-[#92B2EA] cursor-pointer text-left"
                        >
                          Dashboard
                        </button>
                      ) : (
                        <Link
                          to={dashboardLink}
                          onClick={() => setOpen(false)}
                          className="text-white hover:text-[#92B2EA] cursor-pointer"
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
                        className="text-white hover:text-[#FF6B6B] cursor-pointer text-left"
                      >
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </div>
              </Transition>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default MobileMenu;
