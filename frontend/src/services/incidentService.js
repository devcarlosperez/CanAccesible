const apiUrl = 'http://localhost:85/api/incidents';

export const getAllIncidents = async () => {
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error("Error cargando incidencias")
    }
    return await response.json()
  } catch (err) {
    console.error("Error: ",err);
    throw err;
  }
}

export const getIncidentById = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`)

    if (!response.ok) {
      throw new Error("Error cargando incidencia con id")
    }
    return await response.json()
  } catch (err) {
    console.error("Error: ",err);
    throw err
  }
}

export const createIncident = async (incidentData) => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incidentData)
    })

    if (!response.ok) {
      throw new Error("Error creando incidencia")
    }
    return await response.json()
  } catch (err) {
    console.error("Error: ",err)
    throw err
  }
}

export const updateIncident = async (id, incidentData) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incidentData)
    })

    if (!response.ok) {
      throw new Error("Error actualizando incidencia")
    }
    return await response.json()
  } catch (err) {
    console.error("Error: ",err)
    throw err
  }
}

export const deleteIncident = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error("Error eliminando incidencia")
    }
    return await response.json()
  } catch (err) {
    console.error("Error: ",err)
    throw err
  }
}