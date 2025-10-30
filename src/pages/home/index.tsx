import {Header} from "@/components/layout/Header.tsx";
import {FilterSidebar} from "@/components/filters/FilterSidebar.tsx";
import {BloggerTable} from "@/components/bloggers/BloggerTable.tsx";
import {ScrollToTopButton} from "@/components/ui/ScrollToTopButton.tsx";
import {Filter} from "lucide-react";
import {Button, Sheet, SheetContent, SheetTrigger} from "@/ui-kit";
import {useBloggersQuery} from "@/hooks/useBloggers.ts";
import SEOHead from "@/components/SEO/SEOHead.tsx";
import {DEFAULT_FILTER_STATE} from "@/config/filters.ts";

const Index = () => {

  const {
    filters,
    isFilterOpen,
    handleFilterChange,
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center" role="alert" aria-live="assertive">
          <div className="text-red-500 mb-4">Ошибка загрузки данных</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            aria-label="Повторить попытку загрузки данных"
          >
            Повторить попытку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Zorki.pro - Рейтинг блогеров Беларуси"
        description="Платформа, где бренды находят блогеров. Всё удобно и бесплатно."
        keywords={[
          "блогеры беларуси",
          "рейтинг блогеров",
          "инфлюенсеры беларуси",
          "реклама в инстаграм",
          "реклама в тикток",
          "реклама в ютуб",
          "реклама в телеграм",
          "маркетинг беларусь",
          "продвижение блогеров",
          "сотрудничество с блогерами",
        ]}
        url="https://zorki.pro"
        type="website"
      />
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Hidden on mobile by default */}
          <aside
            className="hidden lg:block lg:w-80 flex-shrink-0 fixed top-16 left-4 z-10 max-h-[calc(100vh-4rem)] overflow-y-auto"
            aria-label="Фильтры поиска"
          >
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 lg:ml-[21rem]">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Рейтинг блогеров Беларуси
                </h1>
                <p
                  className="text-sm text-muted-foreground mt-1"
                  aria-live="polite"
                >
                  Блогеров: {totalCount}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <Sheet open={isFilterOpen} onOpenChange={handleFilterToggle}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="lg:hidden"
                      aria-label="Открыть фильтры поиска"
                      aria-expanded={isFilterOpen}
                    >
                      <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
                      Фильтры
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-80 p-0"
                    aria-label="Панель фильтров"
                  >
                    <FilterSidebar
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onClose={() => handleFilterToggle(false)}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </header>

            <section aria-label="Список блогеров">
              <BloggerTable
                bloggers={filteredBloggers}
                loading={loading}
                searchLoading={searchLoading}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={loadMoreBloggers}
                totalCount={totalCount}
              />
            </section>
          </div>
        </div>
      </main>

      <ScrollToTopButton />
    </div>
  );
};

export default Index;
