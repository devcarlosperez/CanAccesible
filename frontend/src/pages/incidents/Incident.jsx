import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Background from "../../components/Background";
import {
  getAllIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
} from "../../services/incidentService";

function Incident() {
  // State management for incidents and form
  const [incidents, setIncidents] = useState([]);
  const [editingIncident, setEditingIncident] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Initial form data with default values
  const initialFormData = {
    name: "",
    description: "",
    incidentStatusId: 1, // Default: Pending
    incidentTypeId: 1, // Default: Good Practice
    incidentSeverityId: 1, // Default: Low severity
    userId: 1, // Hardcoded user ID for now
    island: "",
    area: "",
    latitude: "",
    longitude: "",
    dateIncident: new Date().toISOString().split("T")[0], // Today's date
  };

  const [formData, setFormData] = useState(initialFormData);

  // Load incidents when component mounts
  useEffect(() => {
    fetchIncidents();
  }, []);

  // Fetch all incidents from the API
  const fetchIncidents = async () => {
    try {
      const dataIncidents = await getAllIncidents();
      console.log("Respuesta del servidor:", dataIncidents);
      console.log("Número de incidencias:", dataIncidents.length);
      setIncidents(dataIncidents);
    } catch (err) {
      console.error("Error cargando incidencias:", err);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for both create and update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIncident) {
        await updateIncident(editingIncident.id, formData);
      } else {
        await createIncident(formData);
      }
      setFormData(initialFormData);
      setEditingIncident(null);
      setShowForm(false);
      fetchIncidents();
    } catch (err) {
      console.error("Error guardando incidencia:", err);
    }
  };

  // Populate form with incident data for editing
  const handleEdit = (incident) => {
    setEditingIncident(incident);
    setFormData({
      name: incident.name,
      description: incident.description,
      incidentStatusId: incident.incidentStatusId,
      incidentTypeId: incident.incidentTypeId,
      incidentSeverityId: incident.incidentSeverityId || 1,
      userId: incident.userId,
      island: incident.island,
      area: incident.area,
      latitude: incident.latitude,
      longitude: incident.longitude,
      dateIncident: incident.dateIncident,
    });
    setShowForm(true);
  };

  // Handle incident deletion with confirmation
  const handleDelete = async (id) => {
    try {
      await deleteIncident(id);
      fetchIncidents();
    } catch (err) {
      console.error("Error eliminando incidencia:", err);
    }
  };

  return (
    <section>
      <Header transparent={false} />
      <div className="pt-50 p-8">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">
          Gestión de Incidencias
        </h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setFormData(initialFormData);
                setEditingIncident(null);
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {showForm ? "Cancelar" : "Nueva Incidencia"}
          </button>
        </div>

        {showForm && (
          <div className="flex justify-center mb-6">
            <div className="bg-white p-6 rounded border w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-black mb-4 text-center">
                {editingIncident ? "Editar Incidencia" : "Nueva Incidencia"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 rounded border border-gray-300"
                />
                <textarea
                  name="description"
                  placeholder="Descripción"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full p-2 rounded border border-gray-300"
                />

                <select
                  name="island"
                  value={formData.island}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border"
                >
                  <option value="">Selecciona una isla</option>
                  <option value="Gran Canaria">Gran Canaria</option>
                  <option value="Tenerife">Tenerife</option>
                  <option value="La Gomera">La Gomera</option>
                  <option value="Lanzarote">Lanzarote</option>
                  <option value="Fuerteventura">Fuerteventura</option>
                  <option value="El Hierro">El Hierro</option>
                  <option value="La Palma">La Palma</option>
                </select>

                <select
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border"
                >
                  <option value="">Selecciona un área</option>
                  <option value="movilidad">Movilidad</option>
                  <option value="sensorial">Sensorial</option>
                  <option value="arquitectura">Arquitectura</option>
                  <option value="transporte">Transporte</option>
                  <option value="otro">Otro</option>
                </select>

                <select
                  name="incidentStatusId"
                  value={formData.incidentStatusId}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border border-gray-300"
                >
                  <option value="1">Pendiente</option>
                  <option value="2">En Progreso</option>
                  <option value="3">Resuelta</option>
                </select>

                <select
                  name="incidentTypeId"
                  value={formData.incidentTypeId}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border border-gray-300"
                >
                  <option value="1">Buena Práctica</option>
                  <option value="2">Mala Práctica</option>
                </select>

                {/* Severity field only shows for Bad Practice incidents */}
                {Number(formData.incidentTypeId) === 2 && (
                  <select
                    name="incidentSeverityId"
                    value={formData.incidentSeverityId}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border border-gray-300"
                  >
                    <option value="1">Baja</option>
                    <option value="2">Media</option>
                    <option value="3">Alta</option>
                  </select>
                )}

                <input
                  type="number"
                  name="latitude"
                  placeholder="Latitud"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  step="any"
                  className="w-full p-2 rounded border border-gray-300"
                  required
                />
                <input
                  type="number"
                  name="longitude"
                  placeholder="Longitud"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  step="any"
                  className="w-full p-2 rounded border border-gray-300"
                  required
                />
                <input
                  type="date"
                  name="dateIncident"
                  value={formData.dateIncident}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded border border-gray-300"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  {editingIncident ? "Actualizar" : "Crear"}
                </button>
              </form>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-semibold text-black mb-4 mt-12">
          Lista de incidencias
        </h2>
        {incidents.length === 0 ? (
          <p className="text-black">No hay incidencias registradas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="bg-white p-4 rounded border shadow"
              >
                <h3 className="text-lg font-semibold text-black mb-2">
                  {incident.name}
                </h3>
                <p className="text-gray-700 mb-2">{incident.description}</p>
                <p className="text-sm text-gray-600">
                  Ubicación: {incident.island} - {incident.area}
                </p>
                <p className="text-sm text-gray-600">
                  Coordenadas: {incident.latitude}, {incident.longitude}
                </p>
                {incident.address && (
                  <p className="text-sm text-gray-600">
                    Dirección: {incident.address}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  Fecha: {incident.dateIncident}
                </p>
                <p className="text-sm text-gray-600">
                  Tipo:{" "}
                  {incident.incidentTypeId === 1
                    ? "Buena Práctica"
                    : "Mala Práctica"}
                </p>
                {incident.incidentSeverityId &&
                  incident.incidentTypeId === 2 && (
                    <p className="text-sm text-gray-600">
                      Severidad:{" "}
                      {incident.incidentSeverityId === 1
                        ? "Baja"
                        : incident.incidentSeverityId === 2
                        ? "Media"
                        : "Alta"}
                    </p>
                  )}
                <p className="text-sm text-gray-600">
                  Estado:{" "}
                  {incident.incidentStatusId === 1
                    ? "Pendiente"
                    : incident.incidentStatusId === 2
                    ? "En Progreso"
                    : "Resuelta"}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(incident)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(incident.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Incident;
