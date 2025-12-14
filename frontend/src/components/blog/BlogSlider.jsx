import { useEffect, useState } from 'react';
import EmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getAllBlogArticles } from '../../services/blogArticleService';
import BlogCard from './BlogCard';

/**
 * BlogSlider - Component that displays blog articles in a carousel
 * @param {Array<number>} articleIds - IDs of articles to display (optional)
 * @param {number} maxArticles - Maximum number of articles to show (default: 6)
 */
const BlogSlider = ({ articleIds = null, maxArticles = 6 }) => {
  const [articles, setArticles] = useState([]);
  const [emblaRef, emblaApi] = EmblaCarousel(
    {
      loop: true,
      align: 'start',
      containScroll: 'trimSnaps',
    },
    [Autoplay({ delay: 5000 })]
  );
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  // Fetch articles from API
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await getAllBlogArticles();
        
        // Filter by IDs if provided
        let filteredArticles = data;
        if (articleIds && Array.isArray(articleIds)) {
          filteredArticles = data.filter(article => articleIds.includes(article.id));
        }
        
        // Limit number of articles
        filteredArticles = filteredArticles.slice(0, maxArticles);
        
        setArticles(filteredArticles);
      } catch (err) {
        console.error('Error loading slider articles:', err);
      }
    };

    loadArticles();
  }, [articleIds, maxArticles]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const onSelect = () => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  };

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="w-full px-4 md:px-6 lg:px-0 flex justify-center">
      <div className="w-full max-w-sm md:max-w-4xl lg:max-w-6xl relative">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex gap-4">
          {articles && articles.length > 0 ? (
            articles.map((article) => (
            <div key={article.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 p-1 md:p-2">
              <BlogCard article={article} />
            </div>
            ))
          ) : (
            <div className="flex-[0_0_100%] flex items-center justify-center p-8">
              <p className="text-gray-600">No articles available</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Artículo anterior"
        className="absolute -left-3 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 z-10 bg-white rounded-full p-1.5 md:p-3 shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
      >
        <i className="fa-solid fa-arrow-left text-sm md:text-base"></i>
      </button>
      <button
        onClick={scrollNext}
        aria-label="Artículo siguiente"
        className="absolute -right-3 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-4 z-10 bg-white rounded-full p-1.5 md:p-3 shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
      >
        <i className="fa-solid fa-arrow-right text-sm md:text-base"></i>
      </button>
      </div>
    </div>
  );
};

export default BlogSlider;