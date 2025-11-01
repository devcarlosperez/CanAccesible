import { useState, useEffect } from "react";
import { createUser, updateUser } from "../../../services/userService";

const RegisterForm = ({ onUserCreated, userToEdit, onCancelEdit }) => {
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rol: "",
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Cargar los datos del usuario a editar si existe
  useEffect(() => {
    if (userToEdit) {
      setNewUser({
        firstName: userToEdit.firstName,
        lastName: userToEdit.lastName,
        email: userToEdit.email,
        password: "", // vacía por seguridad
        rol: userToEdit.rol,
      });
    } else {
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        rol: "",
      });
    }
  }, [userToEdit]);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (userToEdit) {
        await updateUser(userToEdit.id, newUser);
        setSuccess("Usuario actualizado con éxito ✅");
        onCancelEdit(); // cerrar modo edición
      } else {
        await createUser(newUser);
        setSuccess("Usuario creado con éxito ✅");
      }

      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        rol: "",
      });

      onUserCreated(); // recargar lista
    } catch (err) {
      console.error("Error:", err);
      setError(userToEdit ? "No se pudo actualizar ❌" : "No se pudo crear ❌");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded-lg shadow-md mb-8"
    >
      <h3 className="text-xl font-semibold mb-4">
        {userToEdit ? "Editar usuario" : "Registrar nuevo usuario"}
      </h3>

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
          required={!userToEdit} // obligatorio solo al crear
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

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            userToEdit
              ? "bg-yellow-600 hover:bg-yellow-500"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {userToEdit ? "Actualizar usuario" : "Crear usuario"}
        </button>

        {userToEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>

      {success && <p className="text-green-400 mt-4">{success}</p>}
      {error && <p className="text-red-400 mt-4">{error}</p>}
    </form>
  );
};

export default RegisterForm;
