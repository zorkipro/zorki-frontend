import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Blogger } from "@/types/blogger";
import { SafeAvatar } from "@/components/ui/SafeAvatar";
import { truncateName, formatNumber, formatPriceWithCurrency } from "@/utils/formatters";
import { normalizeUsername } from "@/utils/username";
import { Star, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { usePromoBloggers } from "@/hooks/usePromoBloggers";
import { Button } from "@/ui-kit";

export const PromoBloggersBlock = () => {
  const { promoBloggers, loading } = usePromoBloggers();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const handleBloggerClick = (handle: string) => {
    navigate(`/${normalizeUsername(handle)}`);
  };

  // Проверка возможности прокрутки
  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Прокрутка к началу/концу
  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollButtons();
    container.addEventListener("scroll", checkScrollButtons);
    const resizeObserver = new ResizeObserver(checkScrollButtons);
    resizeObserver.observe(container);

    // Intersection Observer для анимации появления
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    return () => {
      container.removeEventListener("scroll", checkScrollButtons);
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, [promoBloggers]);

  if (loading) {
    return (
      <div className="mb-4 md:mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200/50 rounded-lg p-3 md:p-6 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/20 to-transparent animate-shimmer" />
          <div className="relative flex items-center justify-center py-2 md:py-4">
            <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (promoBloggers.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 md:mb-8 w-full max-w-full">
      {/* Внешний контейнер с padding для теней */}
      <div className="px-1 md:px-0 w-full max-w-full">
        <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200 rounded-lg p-2 sm:p-3 md:p-6 backdrop-blur-sm w-full max-w-full" style={{ borderWidth: "1px", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
          {/* Декоративный градиентный фон */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-yellow-400/10 to-orange-400/10 animate-pulse rounded-lg" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl -z-0" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-400/20 to-yellow-400/20 rounded-full blur-3xl -z-0" />

          {/* Контент */}
          <div className="relative z-10">
            {/* Заголовок */}
            <div className="flex items-start justify-between gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-6 w-full max-w-full">
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-1 min-w-0 overflow-visible">
                <div className="relative flex-shrink-0 p-1 sm:p-1.5 md:p-2">
                  <div className="absolute inset-0 bg-yellow-400/30 blur-xl rounded-full animate-pulse -z-0" />
                  <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg z-10" style={{ boxShadow: "0 4px 6px -1px rgba(251, 191, 36, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.1)" }}>
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-700 via-yellow-700 to-orange-700 bg-clip-text text-transparent leading-tight break-words line-clamp-2">
                    Обрати внимание на этих блогеров
                  </h2>
                  <p className="text-xs md:text-sm text-amber-600/70 mt-0.5 hidden sm:block">
                    Топ-рекомендации для рекламы
                  </p>
                </div>
              </div>
              {/* Индикатор количества на мобильных */}
              <div className="sm:hidden flex items-center gap-1 text-xs text-amber-600/70 bg-amber-100/50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                <span>{promoBloggers.length}</span>
                <Star className="w-3 h-3 fill-amber-600 text-amber-600" />
              </div>
            </div>

            {/* Контейнер с прокруткой до lg (1024px), сетка на десктопе */}
            <div className="relative w-full max-w-full overflow-hidden">
              {/* Кнопки навигации для экранов меньше lg (1024px) */}
              <div className="lg:hidden absolute left-1 top-1/2 -translate-y-1/2 z-20 flex items-center pointer-events-none">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-full bg-white/95 backdrop-blur-sm shadow-md border-amber-200 hover:bg-amber-50 hover:shadow-lg transition-shadow pointer-events-auto"
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Прокрутить влево"
                >
                  <ChevronLeft className="h-3.5 w-3.5 text-amber-700" />
                </Button>
              </div>
              <div className="lg:hidden absolute right-1 top-1/2 -translate-y-1/2 z-20 flex items-center pointer-events-none">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-full bg-white/95 backdrop-blur-sm shadow-md border-amber-200 hover:bg-amber-50 hover:shadow-lg transition-shadow pointer-events-auto"
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Прокрутить вправо"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-amber-700" />
                </Button>
              </div>

              {/* Горизонтальный скролл до lg (1024px), сетка на десктопе */}
              <div
                ref={scrollContainerRef}
                className="flex lg:grid lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-4 overflow-x-auto lg:overflow-x-visible scrollbar-hide pb-3 lg:pb-0 px-2 sm:px-3 lg:px-0"
                role="list"
                aria-label="Промо-блогеры"
                style={{ 
                  maxWidth: "100%",
                  scrollBehavior: "smooth",
                  WebkitOverflowScrolling: "touch"
                }}
              >
              {promoBloggers.map((blogger, index) => (
                <div
                  key={blogger.id}
                  role="listitem"
                  onClick={() => handleBloggerClick(blogger.handle)}
                  className={`
                    group relative bg-white/90 backdrop-blur-sm rounded-lg 
                    p-2 sm:p-2.5 md:p-4 lg:p-5 border border-amber-200 
                    shadow-sm hover:shadow-xl md:hover:shadow-2xl
                    transition-all duration-300 cursor-pointer 
                    transform hover:-translate-y-1 md:hover:-translate-y-1.5 hover:scale-[1.02]
                    flex-shrink-0 w-[140px] min-[375px]:w-[160px] sm:w-[180px] lg:w-auto lg:min-w-0
                    max-w-full overflow-visible box-border
                    ${isIntersecting ? "animate-fade-in-up" : "opacity-0"}
                  `}
                  style={{
                    maxWidth: "100%",
                    boxSizing: "border-box",
                    animationDelay: `${index * 75}ms`,
                    animationFillMode: "both",
                    // Мягкие тени с правильным размытием
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleBloggerClick(blogger.handle);
                    }
                  }}
                  aria-label={`Просмотреть профиль ${blogger.name}`}
                  onMouseEnter={(e) => {
                    // Улучшенные тени при hover
                    if (window.innerWidth < 768) {
                      e.currentTarget.style.boxShadow = "0 4px 12px 0 rgba(251, 191, 36, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.1)";
                    } else {
                      e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(251, 191, 36, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.04)";
                  }}
                >
                   {/* Декоративный элемент */}
                   <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative flex flex-col items-center text-center w-full min-w-0">
                    {/* Аватар */}
                    <div className="relative mb-2 md:mb-3">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                      <SafeAvatar
                        src={blogger.avatar}
                        alt={`Аватар ${blogger.name}`}
                        className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 ring-2 md:ring-3 ring-amber-300 group-hover:ring-amber-400 transition-all duration-300"
                        style={{
                          boxShadow: "0 2px 8px 0 rgba(251, 191, 36, 0.25), 0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                        }}
                        username={normalizeUsername(blogger.handle)}
                        gender={blogger.gender}
                      />
                      <div 
                        className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1.5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full p-0.5 md:p-1.5 group-hover:scale-110 transition-transform"
                        style={{
                          boxShadow: "0 2px 6px 0 rgba(245, 158, 11, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Star className="w-2 h-2 md:w-3.5 md:h-3.5 text-white fill-white" />
                      </div>
                    </div>

                    {/* Имя и ник */}
                    <h3 className="font-bold text-gray-900 text-xs md:text-sm lg:text-base mb-0.5 md:mb-1 group-hover:text-amber-700 transition-colors leading-tight line-clamp-1 w-full break-words overflow-hidden text-ellipsis">
                      {truncateName(blogger.name, 10)}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-2 leading-tight line-clamp-1 w-full break-all overflow-hidden text-ellipsis">
                      {blogger.handle}
                    </p>

                    {/* Статистика */}
                    <div className="w-full space-y-0.5 md:space-y-1.5 min-w-0">
                      <div className="flex items-center justify-center gap-0.5 md:gap-1 text-xs md:text-sm text-gray-700 flex-wrap justify-center">
                        <span className="font-bold text-gray-900 whitespace-nowrap">{formatNumber(blogger.followers)}</span>
                        <span className="hidden md:inline text-gray-500 text-xs whitespace-nowrap">подписчиков</span>
                        <span className="md:hidden text-gray-500 text-xs whitespace-nowrap">подп.</span>
                      </div>
                      <div className="flex items-center justify-center gap-0.5 md:gap-1 text-xs md:text-sm overflow-hidden">
                        <span className="font-bold text-gray-900">{blogger.engagementRate}%</span>
                        <span className="text-gray-500 text-xs">ER</span>
                      </div>
                       {blogger.postPrice > 0 && (
                         <div 
                           className="text-xs md:text-sm font-bold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-lg px-1.5 md:px-2.5 py-0.5 md:py-1 group-hover:from-amber-200 group-hover:to-yellow-200 transition-all mt-1 md:mt-0 overflow-hidden text-ellipsis whitespace-nowrap"
                           style={{
                             boxShadow: "0 1px 2px 0 rgba(251, 191, 36, 0.2)",
                           }}
                         >
                           {formatPriceWithCurrency(blogger.postPrice)}
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
