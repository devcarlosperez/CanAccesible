import { Link } from "react-router-dom";

const MobileMenu = ({ open, setOpen, menuItems, isAuthenticated, user }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-110 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      ></div>

      {/* Menu lateral */}
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
          {/* Links filtrados */}
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

          {/* Mi cuenta si autenticado */}
          {isAuthenticated && user && (
            <li>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center px-4 py-2 rounded-xl font-semibold text-white bg-blue-700 hover:bg-blue-600 transition duration-200"
              >
                <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center mr-3 text-blue-600  font-bold text-md">
                  U
                </span>
                Mi cuenta
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default MobileMenu;
