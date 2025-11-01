import { useEffect, useState } from "react";
import { getAllUsers } from "../../../services/userService";
import RegisterForm from "./RegisterForm";
import RegisterList from "./RegisterList";
import Header from "../../../components/header/Header";

const Register = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("No se pudieron cargar los usuarios");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Header transparent={false} />

      <div className="pt-40 p-6 text-white min-h-screen bg-neutral-200">
        <h2 className="text-2xl text-black font-bold mb-6">
          Gestión de Usuarios
        </h2>

        <RegisterForm onUserCreated={fetchUsers} />

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {!error && <RegisterList users={users} onUserDeleted={fetchUsers} />}
      </div>
    </>
  );
};

export default Register;
