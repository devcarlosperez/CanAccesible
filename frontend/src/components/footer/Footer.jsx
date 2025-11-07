import logo from "../../assets/canaccesible-logo.png";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center bg-neutral-50 text-neutral-800 py-10 px-6">
      {/* Logo */}
      <div className="transition-all duration-300 hover:scale-105 mb-6">
        <img src={logo} alt="canaccesible-logo" className="h-16 w-auto" />
      </div>

      {/* Secciones */}
      <div className="flex flex-row md:flex-row justify-center gap-16 text-center md:text-left mb-8">
        {/* Compañía */}
        <div className="text-left">
          <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-3 font-poppins font-semibold">
            Compañía
          </h3>
          <ul className="space-y-8 text-base font-roboto font-semibold">
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

        {/* Ayuda */}
        <div className="text-left">
          <h3 className="text-sm uppercase tracking-wider text-neutral-500 mb-3 font-poppins font-semibold">
            Ayuda
          </h3>
          <ul className=" space-y-5 text-base font-roboto font-semibold">
            <li className="hover:text-blue-600 transition-colors cursor-pointer">
              Soporte
            </li>
            <li className="hover:text-blue-600 transition-colors cursor-pointer">
              Términos y <br />
              Condiciones
            </li>
            <li className="hover:text-blue-600 transition-colors cursor-pointer">
              Política de <br />
              Privacidad
            </li>
          </ul>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="flex gap-6 mb-6 text-2xl">
        <a
          href="#"
          className="text-neutral-800 hover:text-red-600 transition-colors"
        >
          <i className="fa-brands fa-youtube"></i>
        </a>
        <a
          href="#"
          className="text-neutral-800 hover:text-blue-700 transition-colors"
        >
          <i className="fa-brands fa-linkedin"></i>
        </a>
        <a
          href="#"
          className="text-neutral-800 hover:text-black transition-colors"
        >
          <i className="fa-brands fa-tiktok"></i>
        </a>
        <a
          href="#"
          className="text-neutral-800 hover:text-pink-600 transition-colors"
        >
          <i className="fa-brands fa-instagram"></i>
        </a>
      </div>
      <p className="text-xs text-neutral-500 text-center">
        © CANACCESIBLE 2025, All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
