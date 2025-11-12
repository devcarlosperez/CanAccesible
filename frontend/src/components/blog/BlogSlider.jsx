import { useEffect, useRef, useState } from 'react';
import EmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const BlogSlider = ({ blogArticles }) => {
  const [emblaRef, emblaApi] = EmblaCarousel(
    {
      loop: true,
      align: 'start',
    },
    [Autoplay({ delay: 5000 })]
  );
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

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
    <div className="w-full max-w-6xl">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex gap-4">
          {blogArticles && blogArticles.map((article) => (
            <div key={article.id} className="flex-[0_0_100%] md:flex-[0_0_33.333%] min-w-0 p-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={article.nameFile}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-2 text-gray-800">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                    {article.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          ← Anterior
        </button>
        <button
          onClick={scrollNext}
          disabled={nextBtnDisabled}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default BlogSlider;