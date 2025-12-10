import { Link } from "react-router-dom";
import logo from "../../assets/canaccesible-logo.webp";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center bg-neutral-100 text-neutral-800 py-10 px-6 lg:px-20">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full max-w-7xl mb-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0 md:w-2/3 ">
          <Link to="/">
            <div className="transition-all duration-300 hover:scale-105 mb-4">
              <img
                src={logo}
                alt="canaccesible-logo"
                className="h-16 lg:h-18 w-auto"
              />
            </div>
          </Link>

          <p className="hidden md:block text-sm text-neutral-600 font-roboto leading-relaxed max-w-sm mb-4">
            CANACCESIBLE promueve un mundo más inclusivo mediante la tecnología
            y la accesibilidad digital.
          </p>

          <div className="flex gap-6 text-3xl">
            <a
              href="#"
              className="text-neutral-800 hover:text-red-600 transition-colors"
            >
              <i className="fa-brands fa-youtube"></i>
            </a>
            <a
              href="#"
              className="text-neutral-800 hover:text-pink-600 transition-colors"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a
              href="#"
              className="text-neutral-800 hover:text-black transition-colors"
            >
              <i className="fa-brands fa-tiktok"></i>
            </a>
            <a
              href="#"
              className="text-neutral-800 hover:text-blue-700 transition-colors"
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>
        <div className="flex flex-row justify-evenly md:justify-around text-center md:text-left w-full md:w-2/3">
          <div className="text-left">
            <h3 className="text-sm uppercase tracking-wider text-neutral-700 mb-3 font-poppins font-semibold">
              Compañía
            </h3>
            <ul className="space-y-8.5 lg:space-y-5 text-base font-roboto font-semibold">
              <li className="hover:text-blue-600 transition-colors cursor-pointer">
                Sobre Nosotros
              </li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">
                Trabajos
              </li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">
                Servicios
              </li>
            </ul>
          </div>
          <div className="text-left">
            <h3 className="text-sm uppercase tracking-wider text-neutral-700 mb-3 font-poppins font-semibold">
              Ayuda
            </h3>
            <ul className="space-y-5 text-base font-roboto font-semibold">
              <li className="hover:text-blue-600 transition-colors cursor-pointer">
                Soporte
              </li>
              <li>
                <Link
                  to={"/terms-conditions"}
                  className="hover:text-blue-600 transition-colors cursor-pointer inline-block"
                >
                  Términos y <br className="block lg:hidden" />
                  <span className="hidden md:inline"> </span>
                  Condiciones
                </Link>
              </li>
              <li>
                <Link
                  to={"/privacy-policy"}
                  className="hover:text-blue-600 transition-colors cursor-pointer inline-block"
                >
                  Política de <br className="block lg:hidden" />
                  <span className="hidden md:inline"> </span>
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="w-full max-w-7xl border-neutral-200 mb-6" />
      <p className="text-xs text-neutral-700 text-center font-roboto">
        © CANACCESIBLE 2025, All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
