import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2 items-center">
      <button 
        onClick={() => changeLanguage('es')}
        className={`px-3 py-1 rounded transition-colors cursor-pointer ${i18n.language.startsWith('es') ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      >
        ES
      </button>
      <button 
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded transition-colors cursor-pointer ${i18n.language.startsWith('en') ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;