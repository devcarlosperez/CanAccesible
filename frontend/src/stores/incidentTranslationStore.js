import { create } from 'zustand';

export const useIncidentTranslationStore = create((set, get) => ({
  // Stores translated texts by incident ID
  // Structure: { [id]: { title: "...", description: "..." } }
  translations: {},

  // Stores current status (whether to show translated or not)
  // Structure: { [id]: boolean }
  translationStatus: {},

  // Saves translated texts to avoid calling the API again
  setTranslatedText: (id, data) => set((state) => ({
    translations: { 
      ...state.translations, 
      [id]: { ...state.translations[id], ...data } 
    }
  })),

  // Toggles display status (ES <-> EN)
  toggleTranslationStatus: (id) => set((state) => ({
    translationStatus: { 
      ...state.translationStatus, 
      [id]: !state.translationStatus[id] 
    }
  })),

  // Helper to check if it is translated
  isTranslated: (id) => get().translationStatus[id] || false,

  // Helper to get texts (returns undefined if they don't exist)
  getTranslation: (id) => get().translations[id],
}));
