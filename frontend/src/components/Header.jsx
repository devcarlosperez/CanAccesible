import { Link } from "react-router-dom";
import logo from "../assets/canaccesible-logo.png";

const Header = () => {
  return (
    <header className="flex justify-between items-center text-white p-14 m-2">
      {/* LOGO */}
      <div>
        <img src={logo} alt="Canarias Accesible" className="h-18 w-auto" />
      </div>
      {/* NAVBAR */}
      <nav className="flex items-center p-4">
        <ul className="flex list-none text-xl gap-19">
          <li>
            <Link
              to="/home"
              className="font-semibold hover:text-accent-1 transition-colors"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="font-semibold hover:text-accent-1 transition-colors"
            >
              Incidencias
            </Link>
          </li>
          <li>
            <Link
              to="/lugares"
              className="font-semibold hover:text-accent-1 transition-colors"
            >
              Islas
            </Link>
          </li>
          <li>
            <Link
              to="/contacto"
              className="font-semibold hover:text-accent-1 transition-colors"
            >
              Contacto
            </Link>
          </li>
        </ul>
      </nav>
      {/* LOGIN BUTTON */}
      <Link
        to="/login"
        className="bg-[#1b226b] text-neutral-1 px-8 py-3 text-xl rounded-xl font-semibold 
               hover:bg-[#162053] hover:scale-105 transition duration-200"
      >
        Iniciar Sesión
      </Link>
    </header>
  );
};

export default Header;
