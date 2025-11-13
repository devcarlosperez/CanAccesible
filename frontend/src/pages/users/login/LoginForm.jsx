import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../services/authService.js";
import logo from "../../../assets/canaccesible-logo-2.png";

const LoginForm = () => {
  const { login, loading, error, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  if (isAuthenticated) {
    navigate("/home");
  }

  return (
    <div
      className="
      bg-white 
      w-full lg:w-1/2 
      flex flex-col items-center justify-center 
      p-6 sm:p-8 lg:p-10
      h-screen lg:h-auto
    "
    >
      <img
        src={logo}
        alt="canaccesible-logo"
        className="h-20 sm:h-24 w-auto mb-4"
      />
      <p className="text-gray-500 text-center max-w-md mb-10 text-sm sm:text-base px-4">
        CANACCESIBLE promueve un mundo más inclusivo mediante la tecnología y la
        accesibilidad digital.
      </p>

      {/* Formulario de login */}
      <form onSubmit={handleSubmit} className="w-full max-w-md font-roboto">
        <label className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">
          Correo electrónico
        </label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2"
        />

        <label className="block mb-2 font-medium text-gray-700 text-sm sm:text-base">
          Contraseña
        </label>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2"
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 mb-6 gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-primary-2" />
            Recuérdame
          </label>
          <a href="#" className="text-primary-2 hover:underline">
            Olvidé mi contraseña
          </a>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold cursor-pointer disabled:opacity-70"
        >
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>

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

export default LoginForm;
