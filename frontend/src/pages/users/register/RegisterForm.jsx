import { useState } from "react";
import { createUser } from "../../../services/userService";

const RegisterForm = ({ onUserCreated }) => {
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rol: "",
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await createUser(newUser);
      setSuccess("Usuario creado con éxito");
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        rol: "",
      });
      onUserCreated();
    } catch (err) {
      console.error("Error al crear usuario:", err);
      setError("No se pudo crear el usuario");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded-lg shadow-md mb-8"
    >
      <h3 className="text-xl font-semibold mb-4">Registrar nuevo usuario</h3>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="Nombre"
          value={newUser.firstName}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Apellido"
          value={newUser.lastName}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={newUser.email}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 text-white col-span-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={newUser.password}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 text-white col-span-2"
          required
        />
        <select
          name="rol"
          value={newUser.rol}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 text-white col-span-2"
          required
        >
          <option value="">Selecciona un rol</option>
          <option value="admin">Administrador</option>
          <option value="user">Usuario</option>
        </select>
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-semibold transition-colors"
      >
        Crear usuario
      </button>

      {success && <p className="text-green-400 mt-4">{success}</p>}
      {error && <p className="text-red-400 mt-4">{error}</p>}
    </form>
  );
};

export default RegisterForm;
