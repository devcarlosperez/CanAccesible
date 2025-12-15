import { create } from 'zustand';

export const useBlogTranslationStore = create((set, get) => ({
  // Almacena los textos traducidos por ID de artículo
  // Estructura: { [id]: { title: "...", description: "...", content: "..." } }
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

  // Establece un estado específico
  setTranslationStatus: (id, status) => set((state) => ({
    translationStatus: { 
      ...state.translationStatus, 
      [id]: status 
    }
  })),

  // Helper para obtener si está traducido
  isTranslated: (id) => get().translationStatus[id] || false,

  // Helper para obtener textos (devuelve undefined si no existen)
  getTranslation: (id) => get().translations[id],
}));
