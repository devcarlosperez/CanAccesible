import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import { getBlogArticleById } from '../../services/blogArticleService';
import { translateText } from '../../services/translationService';
import { useBlogTranslationStore } from '../../stores/blogTranslationStore';

const BlogArticleDetail = () => {
  const { id } = useParams();
  const articleId = parseInt(id);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  
  const { 
    isTranslated: getIsTranslated, 
    getTranslation, 
    setTranslatedText, 
    toggleTranslationStatus 
  } = useBlogTranslationStore();

  const isTranslated = getIsTranslated(articleId);
  const cachedTranslation = getTranslation(articleId);
  
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getBlogArticleById(id);
        setArticle(data);
      } catch (err) {
        console.error('Error al cargar el artículo:', err);
        setError('No se pudo cargar el artículo.');
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    const performTranslation = async () => {
      if (isTranslated && article && !cachedTranslation?.content) {
        setIsLoadingTranslation(true);
        try {
          // Translate title, description and content if not present
          const title = cachedTranslation?.title || await translateText(article.title);
          const description = cachedTranslation?.description || await translateText(article.description);
          const content = await translateText(article.content);

          setTranslatedText(articleId, { 
            title, 
            description, 
            content
          });
        } catch (err) {
          console.error('Translation failed in detail view', err);
        } finally {
          setIsLoadingTranslation(false);
        }
      }
    };

    performTranslation();
  }, [isTranslated, article, cachedTranslation, articleId, setTranslatedText]);

  const handleTranslateToggle = () => {
    toggleTranslationStatus(articleId);
  };

  if (error || !article) {
    return (
      <>
        <Header transparent={false} />
        <main className="min-h-screen bg-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-15 md:mt-20 lg:mt-25">
            {/* Back Button */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 transition-colors mb-8 font-roboto font-medium text-blue-600 hover:text-blue-800"
            >
              <i className="fas fa-arrow-left"></i>
              Volver al Blog
            </Link>

            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-poppins font-bold mb-4 text-neutral-800">
                Artículo no encontrado
              </h1>
              <p className="font-roboto text-neutral-600">
                {error || 'El artículo que buscas no existe.'}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header transparent={false} />
      <main className="min-h-screen bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-15 md:mt-20 lg:mt-25">
          {/* Back Button */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 transition-colors mb-8 sm:mb-10 md:mb-12 font-roboto font-medium text-blue-600 hover:text-blue-800"
          >
            <i className="fas fa-arrow-left"></i>
            Volver al Blog
          </Link>

          {/* Article Container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image */}
            {article.nameFile && (
              <div className="w-full h-48 sm:h-64 md:h-96 lg:h-[500px] bg-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src={article.nameFile}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8 lg:p-10">
              {/* Title */}
              <div className="flex justify-between items-start gap-4 mb-3 sm:mb-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-neutral-800">
                  {isTranslated && cachedTranslation?.title ? cachedTranslation.title : article.title}
                </h1>
                <button
                  onClick={handleTranslateToggle}
                  disabled={isLoadingTranslation}
                  className="shrink-0 px-3 py-1.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-sm font-medium cursor-pointer"
                  title={isTranslated ? "Ver original" : "Traducir al inglés"}
                >
                  {isLoadingTranslation ? "..." : (isTranslated ? "EN" : "ES")}
                </button>
              </div>

              {/* Date */}
              <div className="flex items-center text-xs sm:text-sm mb-4 sm:mb-6 font-roboto text-neutral-600">
                <i className="fas fa-calendar-alt mr-2"></i>
                <span>
                  {article.dateCreation
                    ? new Date(article.dateCreation).toLocaleDateString(isTranslated ? 'en-US' : 'es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Sin fecha'
                  }
                </span>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed font-roboto text-neutral-700">
                {isTranslated && cachedTranslation?.description ? cachedTranslation.description : article.description}
              </p>

              {/* Divider */}
              <hr className="my-6 sm:my-8 border-gray-200" />

              {/* Article Content */}
              <div className="text-sm sm:text-base md:text-lg leading-relaxed sm:leading-relaxed md:leading-8 space-y-4 font-roboto text-neutral-700">
                <div
                  dangerouslySetInnerHTML={{ __html: (isTranslated && cachedTranslation?.content ? cachedTranslation.content : article.content).replace(/\n/g, '<br>') }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogArticleDetail;