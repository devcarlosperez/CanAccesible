import { useEffect, useState } from 'react';
import { getAllBlogArticles } from '../../services/blogArticleService';

const BlogArticlesList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getAllBlogArticles();
        setArticles(data);
      } catch (err) {
        console.error('Error al cargar artículos:', err);
      }
    };

    fetchArticles();
  }, []);

  if (!articles || articles.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-gray-600">No hay artículos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-6 lg:px-0 flex justify-center">
      <div className="w-full max-w-sm md:max-w-4xl lg:max-w-6xl">
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                {/* Image Container */}
                <div className="aspect-video md:aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
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

                {/* Content Container */}
                <div className="p-2 md:p-4 flex flex-col grow">
                  <a 
                    href={`/blog/${article.id}`} 
                    className="font-semibold text-sm md:text-lg line-clamp-2 text-gray-800 hover:text-blue-600 transition-colors inline-block"
                  >
                    {article.title}
                  </a>
                  
                  <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mt-1 md:mt-2 grow">
                    {article.description}
                  </p>

                  {/* Footer with date */}
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
                    <a 
                      href={`/blog/${article.id}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors text-xs font-medium"
                    >
                      Leer más →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogArticlesList;
