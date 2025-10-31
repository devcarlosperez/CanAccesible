// Base API URL for incident endpoints
const apiUrl = "http://localhost:85/api/incidents";

// Fetch all incidents from the server
export const getAllIncidents = async () => {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Error cargando incidencias");
    }
    return await response.json();
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};

// Fetch a single incident by ID
export const getIncidentById = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`);

    if (!response.ok) {
      throw new Error("Error cargando incidencia con id");
    }
    return await response.json();
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};

// Create a new incident
export const createIncident = async (incidentData) => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incidentData),
    });

    if (!response.ok) {
      throw new Error("Error creando incidencia");
    }
    return await response.json();
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};

// Update an existing incident
export const updateIncident = async (id, incidentData) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incidentData),
    });

    if (!response.ok) {
      throw new Error("Error actualizando incidencia");
    }
    return await response.json();
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};

// Delete an incident by ID
export const deleteIncident = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error eliminando incidencia");
    }
    return await response.json();
  } catch (err) {
    console.error("Error: ", err);
    throw err;
  }
};
