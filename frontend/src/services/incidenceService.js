const apiUrl = 'http://localhost:85/api/incidences';

export const getAllIncidences = async () => {
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error("Error fetching incidences")
    }
    return await response.json()
  } catch (err) {
    console.error("Error: ",err);
    throw err;
  }
}

export const getIncidenceById = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`)

    if (!response.ok) {
      throw new Error("Error fetching incidence by id")
    }
    return await response.json()
  } catch (err) {
    console.error("Error: ",err);
    throw err
  }
}

export const createIncidence = async (incidenceData) => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incidenceData)
    })

    if (!response.ok) {
      throw new Error("Error creating incidence")
    }
    return await response.json()
  } catch (err) {
    console.error("Error: ",err)
    throw err
  }
}

export const updateIncidence = async (id, incidenceData) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incidenceData)
    })

    if (!response.ok) {
      throw new Error("Error updating incidence")
    }
    return await response.json()
  } catch (err) {
    console.error("Error: ",err)
    throw err
  }
}

export const deleteIncidence = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error("Error deleting the incidence")
    }
    return await response.json()
  } catch (err) {
    console.error("Error: ",err)
    throw err
  }
}