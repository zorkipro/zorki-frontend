import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdSlide {
  id: string;
  image: string;
  title?: string;
  description?: string;
  link?: string;
  buttonText?: string;
}

interface AdSliderProps {
  slides?: AdSlide[];
  autoPlayInterval?: number;
  showControls?: boolean;
  showDots?: boolean;
}

// Пример данных для рекламы (можно заменить на данные из API)
const defaultSlides: AdSlide[] = [
  {
    id: "1",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='300'%3E%3Crect width='1200' height='300' fill='%23F59E0B'/%3E%3C/svg%3E",
    title: "Специальное предложение",
    description: "Разместите свою рекламу здесь",
    link: "#",
    buttonText: "Узнать больше",
  },
  {
    id: "2",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='300'%3E%3Crect width='1200' height='300' fill='%236365F1'/%3E%3C/svg%3E",
    title: "Новое предложение",
    description: "Привлеките внимание к своему бренду",
    link: "#",
    buttonText: "Связаться",
  },
  {
    id: "3",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='300'%3E%3Crect width='1200' height='300' fill='%2310B981'/%3E%3C/svg%3E",
    title: "Акция",
    description: "Ограниченное предложение",
    link: "#",
    buttonText: "Подробнее",
  },
];

export const AdSlider = ({
  slides = defaultSlides,
  autoPlayInterval = 5000,
  showControls = true,
  showDots = true,
}: AdSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  // Автопрокрутка
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, isPaused, autoPlayInterval, slides.length]);

  const handleSlideClick = (slide: AdSlide) => {
    if (slide.link && slide.link !== "#") {
      window.open(slide.link, "_blank", "noopener,noreferrer");
    }
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full max-w-full mb-4 md:mb-6 rounded-lg overflow-hidden bg-white border border-gray-200"
      style={{ borderWidth: "1px", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Слайды */}
      <div className="relative w-full aspect-[3/1] max-md:aspect-[3/2] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div
              className="relative w-full h-full cursor-pointer group"
              onClick={() => handleSlideClick(slide)}
            >
              <img
                src={slide.image}
                alt={slide.title || `Реклама ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                style={{ maxWidth: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Минималистичный overlay для текста */}
              {(slide.title || slide.description || slide.buttonText) && (
                <div className="absolute inset-0 flex items-center justify-center md:justify-start px-2 sm:px-4 overflow-hidden">
                  <div className="w-full max-w-full px-2 sm:px-4 md:px-6 lg:px-8 text-center md:text-left overflow-hidden">
                    {slide.title && (
                      <h3 className="text-white text-xs min-[375px]:text-sm min-[400px]:text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-0.5 sm:mb-1 md:mb-2 drop-shadow-sm line-clamp-2 break-words overflow-hidden">
                        {slide.title}
                      </h3>
                    )}
                    {slide.description && (
                      <p className="text-white/95 text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 md:mb-3 hidden min-[400px]:block drop-shadow-sm line-clamp-2 break-words overflow-hidden">
                        {slide.description}
                      </p>
                    )}
                    {slide.buttonText && (
                      <button
                        className="inline-block px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-white/95 hover:bg-white text-gray-900 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSlideClick(slide);
                        }}
                      >
                        {slide.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Минималистичные кнопки навигации */}
      {showControls && slides.length > 1 && (
        <>
          <button
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Предыдущий слайд"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-white/80 drop-shadow-md mx-auto" />
          </button>
          <button
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Следующий слайд"
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-white/80 drop-shadow-md mx-auto" />
          </button>
        </>
      )}

      {/* Минималистичные индикаторы */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-6 sm:w-8"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

