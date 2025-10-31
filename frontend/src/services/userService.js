const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

// Obtener todos los usuarios
export async function getAllUsers() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error al obtener los usuarios");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en getAllUsers:", error);
    throw error;
  }
}
