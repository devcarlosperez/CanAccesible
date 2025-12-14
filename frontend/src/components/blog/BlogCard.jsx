import { useState } from 'react';
import { Link } from 'react-router-dom';
import { translateText } from '../../services/translationService';

const BlogCard = ({ article }) => {
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedData, setTranslatedData] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isTranslated) {
      setIsTranslated(false);
      return;
    }

    if (translatedData.title && translatedData.description) {
      setIsTranslated(true);
      return;
    }

    setIsLoading(true);
    try {
      const [title, description] = await Promise.all([
        translateText(article.title),
        translateText(article.description)
      ]);
      setTranslatedData({ title, description });
      setIsTranslated(true);
    } catch (error) {
      console.error('Failed to translate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="aspect-video md:aspect-square bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
        {article.nameFile ? (
          <img
            src={article.nameFile}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <i className="fas fa-image text-gray-400 text-3xl"></i>
          </div>
        )}
      </div>

      <div className="p-2 md:p-4 flex flex-col grow">
        <Link
          to={`/blog/${article.id}`}
          className="font-semibold text-sm md:text-lg line-clamp-2 text-gray-800 hover:text-blue-600 transition-colors inline-block"
        >
          {isTranslated ? translatedData.title : article.title}
        </Link>
        
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mt-1 md:mt-2 grow">
          {isTranslated ? translatedData.description : article.description}
        </p>

        <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {article.dateCreation 
              ? new Date(article.dateCreation).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : 'Sin fecha'
            }
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleTranslate}
              disabled={isLoading}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                isTranslated 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={isTranslated ? "Ver original" : "Traducir al inglés"}
            >
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                isTranslated ? 'ES' : 'EN'
              )}
            </button>
            
            <Link
              to={`/blog/${article.id}`}
              className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
            >
              Leer más
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
