import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdSlide {
  id: string;
  image: string; // Для больших разрешений
  imageMobile?: string; // Для маленьких разрешений (когда меняется соотношение сторон)
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

// Данные для рекламы
const defaultSlides: AdSlide[] = [
  {
    id: "mediaway-new",
    image: "https://zorkipro.s3.us-east-1.amazonaws.com/default/blogger/ads/m1.webp",
    imageMobile: "https://zorkipro.s3.us-east-1.amazonaws.com/default/blogger/ads/m2.webp",
    link: "https://mediaway.one",
  },
  {
    id: "mediaway",
    image: "https://zorkipro.s3.us-east-1.amazonaws.com/default/blogger/ads/m1.webp",
    imageMobile: "https://zorkipro.s3.us-east-1.amazonaws.com/default/blogger/ads/m2.webp",
    link: "https://mediaway.one",
  },
  {
    id: "1",
    image: "https://zorkipro.s3.us-east-1.amazonaws.com/default/blogger/ads/1a+(1).webp",
    imageMobile: "https://zorkipro.s3.us-east-1.amazonaws.com/default/blogger/ads/1b+(1).webp",
    link: "https://adwize.me/p/ad3",
  },
  {
    id: "2",
    image: "https://zorkipro.s3.us-east-1.amazonaws.com/default/blogger/ads/2a+(1).webp",
    imageMobile: "https://zorkipro.s3.us-east-1.amazonaws.com/default/blogger/ads/2b+(1).webp",
    link: "https://pr.adwize.me/sales",
  },
  {
    id: "3",
    image: "", // Нет изображения, используем только текст и кнопку
    imageMobile: "",
    link: "/proads",
    title: "Разместите рекламу на Zorki.pro",
    description: "Доступ к самым влиятельным блогерам и маркетологам Беларуси",
    buttonText: "Узнать больше",
  },
];

export const AdSlider = ({
  slides = defaultSlides,
  autoPlayInterval = 10000,
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
      // Если ссылка относительная (начинается с /), используем window.location
      if (slide.link.startsWith("/")) {
        window.location.href = slide.link;
      } else {
        // Для внешних ссылок открываем в новой вкладке
        window.open(slide.link, "_blank", "noopener,noreferrer");
      }
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
              {slide.image ? (
                <picture className="w-full h-full">
                  {slide.imageMobile && (
                    <source
                      media="(max-width: 768px)"
                      srcSet={slide.imageMobile}
                    />
                  )}
                  <img
                    src={slide.image}
                    alt={slide.title || `Реклама ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover",
                      minWidth: "100%",
                      minHeight: "100%"
                    }}
                  />
                </picture>
              ) : (
                // Фон для слайда без изображения
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
              )}
              {/* Текст и кнопка для слайдов */}
              {(slide.title || slide.description || slide.buttonText) && (
                <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8 overflow-hidden">
                  <div className="w-full max-w-2xl text-center overflow-hidden">
                    {slide.title && (
                      <h3 className="text-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 drop-shadow-sm line-clamp-2 break-words">
                        {slide.title}
                      </h3>
                    )}
                    {slide.description && (
                      <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-4 sm:mb-6 drop-shadow-sm line-clamp-2 break-words">
                        {slide.description}
                      </p>
                    )}
                    {slide.buttonText && (
                      <button
                        className="inline-block px-6 py-3 sm:px-8 sm:py-4 bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg whitespace-nowrap"
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
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-black/10 hover:bg-black/20 transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Предыдущий слайд"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-black/60 drop-shadow-md mx-auto" />
          </button>
          <button
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-black/10 hover:bg-black/20 transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Следующий слайд"
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-black/60 drop-shadow-md mx-auto" />
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
                  ? "bg-black/50 w-6 sm:w-8"
                  : "bg-black/20 hover:bg-black/35"
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

