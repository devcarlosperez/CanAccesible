import logo from "../../../assets/canaccesible-logo-2.png";

const LeftSide = () => {
  return (
    <div className="bg-white w-1/2 flex flex-col items-center justify-center p-10">
      {/* Logo */}
      <img src={logo} alt="canaccesible-logo" className="h-26 w-auto mb-4" />

      {/* Descripción */}
      <p className="text-gray-500 text-center max-w-md mb-10">
        CANACCESIBLE promueve un mundo más inclusivo mediante la tecnología y la
        accesibilidad digital.
      </p>

      {/* Formulario */}
      <form className="w-full max-w-md font-roboto">
        {/* Correo */}
        <label className="block mb-2 font-medium text-gray-700">
          Correo electrónico
        </label>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2"
        />

        {/* Contraseña */}
        <label className="block mb-2 font-medium text-gray-700">
          Contraseña
        </label>
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2"
        />

        {/* Opciones */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-primary-2" />
            Recuérdame
          </label>
          <a href="#" className="text-primary-2 hover:underline">
            Olvidé mi contraseña
          </a>
        </div>

        {/* Botón */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold cursor-pointer">
          Iniciar Sesión
        </button>

        {/* Enlace inferior */}
        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes una cuenta?{" "}
          <a
            href="/register"
            className="text-primary-2 font-medium hover:underline"
          >
            Crear cuenta gratis
          </a>
        </p>
      </form>
    </div>
  );
};

export default LeftSide;
