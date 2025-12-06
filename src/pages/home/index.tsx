import {Header} from "@/components/layout/Header.tsx";
import {FilterSidebar} from "@/components/filters/FilterSidebar.tsx";
import {BloggerTable} from "@/components/bloggers/BloggerTable.tsx";
import {ScrollToTopButton} from "@/components/ui/ScrollToTopButton.tsx";
import {Filter} from "lucide-react";
import {Button, Sheet, SheetContent, SheetTrigger} from "@/ui-kit";
import {useBloggersQuery} from "@/hooks/useBloggers.ts";
import SEOHead from "@/components/SEO/SEOHead.tsx";
import {DEFAULT_FILTER_STATE} from "@/config/filters.ts";
import {ContentWrapper} from "@/components/layout/ContentWrapper.tsx";
import {AdSlider} from "@/components/ad/AdSlider.tsx";
import {SEOContent} from "@/components/SEO/SEOContent.tsx";
import {FAQSection, getFAQSchema} from "@/components/SEO/FAQSection.tsx";

// Расширенный список ключевых слов для SEO (100+ запросов)
const SEO_KEYWORDS: string[] = [
  // 🎯 ТОПовые запросы (ядро)
  "рейтинг блогеров беларуси",
  "топ блогеров беларуси",
  "блогеры беларуси",
  "лучшие блогеры беларуси",
  "популярные блогеры беларуси",
  "инфлюенсеры беларуси",
  "блогеры минска",
  
  // 💸 Коммерческие запросы (конверсионные)
  "сколько стоит реклама у блогеров",
  "где купить рекламу у блогера",
  "реклама у блогеров беларусь",
  "заказать рекламу у блогеров",
  "подбор блогеров беларусь",
  "купить рекламу у блогера",
  "реклама у блогеров беларуси цена",
  "заказать рекламную интеграцию",
  "стоимость рекламы у блогеров беларуси",
  "прайс блогеров беларуси",
  "поиск блогеров для рекламы",
  "подбор блогеров для рекламы",
  "блогеры для рекламы беларусь",
  "сотрудничество с блогерами беларусь",
  
  // 📍 Гео-запросы (Минск)
  "блогеры минск",
  "топ блогеров минск",
  "инстаграм блогеры минск",
  "тикток блогеры минск",
  "сколько стоит реклама у минских блогеров",
  
  // 📍 Гео-запросы (другие города)
  "блогеры гродно",
  "блогеры брест",
  "блогеры витебск",
  "блогеры гомель",
  "блогеры могилев",
  
  // 📱 Instagram
  "инстаграм блогеры беларуси",
  "топ инстаграм блогеров беларуси",
  "блогеры инстаграм минск",
  "сколько стоит реклама в инстаграм у блогера",
  
  // 📱 TikTok
  "тиктокеры беларуси",
  "топ тиктокеров беларуси",
  "популярные тиктокеры беларуси",
  
  // 📱 YouTube
  "ютуб блогеры беларуси",
  "белорусские ютуберы",
  "топ ютуберов беларуси",
  "реклама у ютуб блогеров беларуси",
  
  // 📱 Telegram
  "телеграм каналы беларуси",
  "топ телеграм каналов беларуси",
  "рекламные каналы беларусь",
  
  // 🎯 Запросы рекламодателей
  "какого блогера выбрать для рекламы",
  "где искать блогеров для рекламы",
  "эффективная реклама у блогеров",
  "топ блогеров для рекламы 2025",
  "лучшие блогеры для рекламы беларусь",
  
  // 🔍 Информационные
  "как выбрать блогера для рекламы",
  "как проверить блогера перед рекламой",
  "как узнать цену рекламы у блогера",
  "как оценить эффективность рекламы у блогеров",
  "как работает реклама у блогеров",
  "ошибки при покупке рекламы у блогеров",
  
  // 🧩 Ниши
  "мамские блогеры беларусь",
  "travel блогеры беларусь",
  "fashion блогеры беларусь",
  "beauty блогеры беларусь",
  "lifestyle блогеры беларусь",
  "food блогеры беларусь",
  "авто блогеры беларуси",
  "бизнес блогеры беларусь",
  "юмор блогеры беларусь",
  
  // 🏷️ Запросы по аудитории
  "блогеры с женской аудиторией беларусь",
  "блогеры с мужской аудиторией беларусь",
  "блогеры до 100к подписчиков беларусь",
  "микро-блогеры беларусь",
  "блогеры с высоким ER беларусь",
];

const Index = () => {
// const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    filters,
    isFilterOpen,
      setIsFilterOpen,
    handleFilterChange:setFilters,
    handleFilterToggle,
    allBloggers,
    filteredBloggers,
    loading,
    searchLoading,
    error,
    totalCount,
    hasMore,
    isLoadingMore,
    loadMoreBloggers,
  } = useBloggersQuery(DEFAULT_FILTER_STATE);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Рейтинг блогеров Беларуси 2025 | Топ блогеров | Сколько стоит реклама | Zorki.pro"
        description="Рейтинг и топ блогеров Беларуси 2025. Каталог лучших и популярных инфлюенсеров Instagram, TikTok, YouTube, Telegram. Узнайте сколько стоит реклама у блогеров. Где купить рекламу у блогера. Подбор блогеров для рекламы в Минске, Гродно, Бресте, Витебске, Гомеле, Могилеве. Прайс и цены на рекламу у блогеров."
        keywords={SEO_KEYWORDS}
        url="https://zorki.pro"
        type="website"
      />
      {/* FAQ Schema для Google Rich Results */}
      <script type="application/ld+json">
        {JSON.stringify(getFAQSchema())}
      </script>
      {/* ItemList Schema для рейтинга блогеров */}
      {totalCount > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Рейтинг блогеров Беларуси 2025",
            "description": "Топ блогеров и инфлюенсеров Беларуси по популярности",
            "numberOfItems": totalCount,
            "itemListElement": {
              "@type": "ListItem",
              "position": 1,
              "name": "Каталог блогеров Беларуси",
              "url": "https://zorki.pro"
            }
          })}
        </script>
      )}
      <Header />

      <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-20 sm:pb-24 min-[430px]:pb-8 max-w-full" style={{ paddingTop: '5.5rem' }}>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 w-full max-w-full">
          <aside className="hidden lg:block lg:w-80 flex-shrink-0 lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-4rem)] lg:z-10">
            <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-muted h-full pr-2">
              <FilterSidebar filters={filters} onFilterChange={setFilters} />
            </div>
          </aside>

          <div className="flex-1 w-full min-w-0 max-w-full overflow-x-hidden">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 w-full max-w-full">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground break-words">
                  Рейтинг блогеров Беларуси
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  В каталоге: {totalCount} блогеров
                </p>
              </div>
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden flex-shrink-0">
                    <Filter className="w-4 h-4 mr-2" />
                    Фильтры
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-80 p-0 max-w-[90vw] flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto overscroll-contain">
                    <FilterSidebar filters={filters} onFilterChange={setFilters} onClose={() => setIsFilterOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
            </header>

            {error && <div className="text-center py-6 sm:py-8 text-red-500 text-sm sm:text-base break-words px-2">Ошибка: {error}</div>}

            {/* Промо карусель */}
            <ContentWrapper><AdSlider /></ContentWrapper>

            {/* Промо блогеры с топовыми блогерами - закомментировано */}
            {/* <ContentWrapper allowShadow overflowHidden={false}><PromoBloggersBlock /></ContentWrapper> */}

            {/* Таблица блогеров - сначала показываем таблицу */}
            <ContentWrapper>
              <BloggerTable bloggers={allBloggers} loading={loading} hasMore={hasMore} isLoadingMore={isLoadingMore} onLoadMore={loadMoreBloggers} totalCount={totalCount} />
            </ContentWrapper>

            {/* SEO-контент с ключевыми запросами - под таблицей */}
            <ContentWrapper>
              <SEOContent />
              <FAQSection />
            </ContentWrapper>
          </div>
        </div>
      </main>
<ScrollToTopButton />
</div>
);
};

export default Index;


//import { useState } from "react";
// import { Header } from "@/components/layout/Header";
// import { FilterSidebar } from "@/components/filters/FilterSidebar";
// import { BloggerTable } from "@/components/bloggers/BloggerTable";
// // import { PromoBloggersBlock } from "@/components/bloggers/PromoBloggersBlock";
// // import { AdSlider } from "@/components/ad/AdSlider";
// import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
// import { ContentWrapper } from "@/components/layout/ContentWrapper";
// import { Filter } from "lucide-react";
// import { Button, Sheet, SheetContent, SheetTrigger } from "@/ui-kit";
// import { useBloggers } from "@/hooks/useBloggers";
// import SEOHead from "@/components/SEO/SEOHead";
// import { DEFAULT_FILTER_STATE } from "@/config/filters";
//
// const SEO_KEYWORDS = ["блогеры беларуси", "рейтинг блогеров", "инфлюенсеры беларуси", "реклама в инстаграм", "реклама в тикток", "реклама в ютуб", "реклама в телеграм", "маркетинг беларусь", "продвижение блогеров", "сотрудничество с блогерами"] as const;
//
// const Index = () => {
//   const [filters, setFilters] = useState(DEFAULT_FILTER_STATE);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const { filteredBloggers: bloggers, loading, hasMore, isLoadingMore, loadMoreBloggers, totalCount, error } = useBloggers(filters);
//
//   return (
//     <div className="min-h-screen bg-background">
//       <SEOHead
//         title="Zorki.pro - Рейтинг блогеров Беларуси"
//         description="Платформа, где бренды находят блогеров. Всё удобно и бесплатно."
//         keywords={SEO_KEYWORDS}
//         url="https://zorki.pro"
//         type="website"
//       />
//       <Header />
//
//       <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-20 sm:pb-24 min-[430px]:pb-8 max-w-full overflow-x-hidden">
//         <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 w-full max-w-full">
//           <aside className="hidden lg:block lg:w-80 flex-shrink-0 lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-4rem)] z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-muted">
//             <FilterSidebar filters={filters} onFilterChange={setFilters} />
//           </aside>
//
//           <div className="flex-1 w-full min-w-0 max-w-full overflow-x-hidden">
//             <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 w-full max-w-full">
//               <div className="min-w-0 flex-1">
//                 <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground break-words">Рейтинг блогеров Беларуси</h1>
//                 <p className="text-xs sm:text-sm text-muted-foreground mt-1">Блогеров: {totalCount}</p>
//               </div>
//               <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
//                 <SheetTrigger asChild>
//                   <Button variant="outline" className="lg:hidden flex-shrink-0">
//                     <Filter className="w-4 h-4 mr-2" />
//                     Фильтры
//                   </Button>
//                 </SheetTrigger>
//                 <SheetContent side="left" className="w-[280px] sm:w-80 p-0 max-w-[90vw]">
//                   <FilterSidebar filters={filters} onFilterChange={setFilters} onClose={() => setIsFilterOpen(false)} />
//                 </SheetContent>
//               </Sheet>
//             </header>
//
//             {error && <div className="text-center py-6 sm:py-8 text-red-500 text-sm sm:text-base break-words px-2">Ошибка: {error}</div>}
//
//             {/* Промо карусель - закомментировано */}
//             {/* <ContentWrapper><AdSlider /></ContentWrapper> */}
//
//             {/* Промо блогеры с топовыми блогерами - закомментировано */}
//             {/* <ContentWrapper allowShadow overflowHidden={false}><PromoBloggersBlock /></ContentWrapper> */}
//
//             <ContentWrapper>
//               <BloggerTable bloggers={bloggers} loading={loading} hasMore={hasMore} isLoadingMore={isLoadingMore} onLoadMore={loadMoreBloggers} totalCount={totalCount} />
//             </ContentWrapper>
//           </div>
//         </div>
//       </main>
//<ScrollToTopButton />
// </div>
// );
// };
//
// export default Index;


