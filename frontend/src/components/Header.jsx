import { Link } from "react-router-dom";
import logo from "../assets/canaccesible-logo.png";

const Header = () => {
  return (
    <header className="bg-accent-1 text-white shadow-md">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div>
          <img src={logo} alt="Canarias Accesible" className="h-12 w-auto" />
        </div>

        <ul className="flex space-x-6">
          <li>
            <Link
              to="/home"
              className="hover:text-accent-2 transition-colors font-semibold"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/reportar"
              className="hover:text-accent-2 transition-colors font-semibold"
            >
              Incidencias
            </Link>
          </li>
          <li>
            <Link
              to="/lugares"
              className="hover:text-accent-2 transition-colors font-semibold"
            >
              Islas
            </Link>
          </li>
          <li>
            <Link
              to="/contacto"
              className="hover:text-accent-2 transition-colors font-semibold"
            >
              Contacto
            </Link>
          </li>
        </ul>

        {/* Botón */}
        <Link
          to="/login"
          className="bg-[#1b226b] text-neutral-1 px-4 py-2 rounded-xl font-semibold 
             hover:bg-[#162053] hover:scale-102 transition duration-200"
        >
          Iniciar Sesión
        </Link>
      </nav>
    </header>
  );
};

export default Header;
