import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/userService";
import Header from "../../components/header/Header";

const Register = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllUsers()
      .then((data) => {
        console.log("Usuarios recibidos:", data);
        setUsers(data);
      })
      .catch((err) => {
        console.error("Error al obtener usuarios:", err);
        setError("No se pudieron cargar los usuarios ");
      });
  }, []);

  return (
    <>
      <Header transparent={false} />

      {/* Contenedor principal con padding-top para que no quede debajo del header */}
      <div className="pt-40 p-6 text-white min-h-screen bg-gray-900">
        <h2 className="text-2xl font-bold mb-6">Lista de Usuarios</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {users.length === 0 && !error ? (
          <p>No hay usuarios registrados.</p>
        ) : (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Register;
