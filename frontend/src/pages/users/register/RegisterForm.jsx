import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../services/authService.js";
import logo from "../../../assets/canaccesible-logo-2.png";
import { createUser } from "../../../services/userService.js";

const RegisterForm = () => {
  const { login, loading, error: authError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rol: "",
    avatar: null,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewUser({ ...newUser, avatar: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();
      formData.append("firstName", newUser.firstName);
      formData.append("lastName", newUser.lastName);
      formData.append("email", newUser.email);
      formData.append("password", newUser.password);
      formData.append("roleId", newUser.rol);

      if (newUser.avatar) {
        formData.append("image", newUser.avatar);
      }

      await createUser(formData);
      await login(newUser.email, newUser.password);
      navigate("/home");
    } catch (err) {
      console.error("Error en registro o login:", err);
      setError("No se pudo registrar el usuario");
    }
  };

  return (
    <div className="bg-white w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10 h-screen lg:h-auto">
      <img
        src={logo}
        alt="canaccesible-logo"
        className="h-20 sm:h-24 w-auto mb-4"
      />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md font-roboto"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={newUser.firstName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Apellidos"
            value={newUser.lastName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={newUser.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2 mt-4"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={newUser.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2 mt-4"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Foto de perfil
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2"
            />
            {newUser.avatar && (
              <img
                src={URL.createObjectURL(newUser.avatar)}
                alt="preview"
                className="mt-2 w-24 h-24 object-cover rounded-full border border-gray-500"
              />
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Tipo de cuenta
            </label>
            <select
              value={newUser.rol}
              onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-2"
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="1">Usuario</option>
              <option value="3">Municipio</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl mt-6 hover:bg-blue-700 transition font-semibold"
        >
          {loading ? "Cargando..." : "Registrarse"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes una cuenta?{" "}
          <a
            href="/login"
            className="text-primary-2 font-medium hover:underline"
          >
            Iniciar sesión aquí
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
