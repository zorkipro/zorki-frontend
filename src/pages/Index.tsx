import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { BloggerTable } from "@/components/bloggers/BloggerTable";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { Filter } from "lucide-react";
import { Button, Sheet, SheetContent, SheetTrigger } from "@/ui-kit";
import { useBloggers } from "@/hooks/useBloggers";
import SEOHead from "@/components/SEO/SEOHead";
import { DEFAULT_FILTER_STATE } from "@/config/filters";

const SEO_KEYWORDS = [
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
];

const Index = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTER_STATE);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { filteredBloggers: bloggers, loading, hasMore, isLoadingMore, loadMoreBloggers, totalCount, error } = useBloggers(filters);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Zorki.pro - Рейтинг блогеров Беларуси"
        description="Платформа, где бренды находят блогеров. Всё удобно и бесплатно."
        keywords={SEO_KEYWORDS}
        url="https://zorki.pro"
        type="website"
      />
      <Header />

      <main className="container mx-auto px-4 py-8 pb-24 min-[430px]:pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block lg:w-80 flex-shrink-0 fixed top-16 left-4 z-10 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <FilterSidebar filters={filters} onFilterChange={setFilters} />
          </aside>

          <div className="flex-1 lg:ml-[21rem]">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Рейтинг блогеров Беларуси</h1>
                <p className="text-sm text-muted-foreground mt-1">Блогеров: {totalCount}</p>
              </div>
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="w-4 h-4 mr-2" />
                    Фильтры
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <FilterSidebar filters={filters} onFilterChange={setFilters} onClose={() => setIsFilterOpen(false)} />
                </SheetContent>
              </Sheet>
            </header>

            {error && <div className="text-center py-8 text-red-500">Ошибка: {error}</div>}
            <BloggerTable
              bloggers={bloggers}
              loading={loading}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={loadMoreBloggers}
              totalCount={totalCount}
            />
          </div>
        </div>
      </main>

      <ScrollToTopButton />
    </div>
  );
};

export default Index;
