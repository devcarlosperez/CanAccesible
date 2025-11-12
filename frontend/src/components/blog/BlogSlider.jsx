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
    <div className="w-full px-4 md:px-6 lg:px-0 flex justify-center">
      <div className="w-full max-w-sm md:max-w-4xl lg:max-w-6xl relative">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex gap-4">
          {blogArticles && blogArticles.map((article) => (
            <div key={article.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 p-1 md:p-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="aspect-video md:aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={article.nameFile}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 md:p-4">
                  <a href={`/blog/${article.id}`} className="font-semibold text-sm md:text-lg line-clamp-2 text-gray-800 hover:text-blue-600 transition-colors inline-block">
                    {article.title}
                  </a>
                  <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mt-1 md:mt-2">
                    {article.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute -left-3 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-4 z-10 bg-white rounded-full p-1.5 md:p-3 shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
      >
        <i className="fa-solid fa-arrow-left text-sm md:text-base"></i>
      </button>
      <button
        onClick={scrollNext}
        className="absolute -right-3 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-4 z-10 bg-white rounded-full p-1.5 md:p-3 shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
      >
        <i className="fa-solid fa-arrow-right text-sm md:text-base"></i>
      </button>
      </div>
    </div>
  );
};

export default BlogSlider;