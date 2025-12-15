import { create } from 'zustand';

export const useIncidentTranslationStore = create((set, get) => ({
  // Almacena los textos traducidos por ID de incidencia
  // Estructura: { [id]: { title: "...", description: "..." } }
  translations: {},

  // Almacena el estado actual (si se debe mostrar traducido o no)
  // Estructura: { [id]: boolean }
  translationStatus: {},

  // Guarda los textos traducidos para no volver a llamar a la API
  setTranslatedText: (id, data) => set((state) => ({
    translations: { 
      ...state.translations, 
      [id]: { ...state.translations[id], ...data } 
    }
  })),

  // Cambia el estado de visualización (ES <-> EN)
  toggleTranslationStatus: (id) => set((state) => ({
    translationStatus: { 
      ...state.translationStatus, 
      [id]: !state.translationStatus[id] 
    }
  })),

  // Helper para obtener si está traducido
  isTranslated: (id) => get().translationStatus[id] || false,

  // Helper para obtener textos (devuelve undefined si no existen)
  getTranslation: (id) => get().translations[id],
}));
