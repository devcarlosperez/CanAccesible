import { deleteUser } from "../../../services/userService";

const RegisterList = ({ users, onUserDeleted, onUserEdit }) => {
  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmed) return;

    try {
      await deleteUser(id);
      onUserDeleted();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("No se pudo eliminar el usuario ❌");
    }
  };

  if (!users || users.length === 0) {
    return <p className="text-black">No hay usuarios registrados.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-700 text-left">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Apellido</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Fecha Registro</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">{user.firstName}</td>
              <td className="px-4 py-2">{user.lastName}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.dateRegister}</td>
              <td className="px-4 py-2 capitalize">{user.rol}</td>
              <td className="px-4 py-2 flex gap-2">
                {/* Botón Editar */}
                <button
                  onClick={() => onUserEdit(user)}
                  className="flex items-center gap-1 bg-yellow-600 hover:bg-yellow-500 px-2 py-1 rounded text-white font-semibold transition-colors"
                  title="Editar usuario"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>

                {/* Botón Eliminar */}
                <button
                  onClick={() => handleDelete(user.id)}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-white font-semibold transition-colors"
                  title="Eliminar usuario"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegisterList;
