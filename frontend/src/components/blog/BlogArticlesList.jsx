import { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';
import { getAllBlogArticles } from '../../services/blogArticleService';
import BlogCard from './BlogCard';

const BlogArticlesList = ({ onPageChange }) => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

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

  // Notificar al padre cuando cambia la página
  useEffect(() => {
    if (onPageChange) {
      onPageChange(page);
    }
  }, [page, onPageChange]);

  // Calcular índices para paginación
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArticles = articles.slice(startIndex, endIndex);
  const pageCount = Math.ceil(articles.length / itemsPerPage);

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
    <div className="w-full px-4 md:px-6 lg:px-0 flex flex-col items-center">
      <div className="w-full max-w-sm md:max-w-4xl lg:max-w-6xl">
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
          {paginatedArticles.map((article) => (
            <div 
              key={article.id} 
              className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
            >
              <BlogCard article={article} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {articles.length > itemsPerPage && (
          <div className="flex justify-center mt-8">
            <Pagination
              count={pageCount}
              page={page}
              onChange={(e, value) => {
                setPage(value);
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              }}
              color="primary"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogArticlesList;
