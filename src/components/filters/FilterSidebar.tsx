import { memo, useCallback, useState, useEffect } from "react";
import { Input } from "@/ui-kit";
import { Label } from "@/ui-kit";
import { Button } from "@/ui-kit";
import { Checkbox } from "@/ui-kit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui-kit";
import { FilterState } from "@/types/blogger";
import { RotateCcw } from "lucide-react";
import { logError } from "@/utils/logger";
import { DEFAULT_FILTER_STATE } from "@/config/filters";
import {
  getAllCategories,
  getAllRestrictedTopics,
} from "@/api/endpoints/topics";
import type { TopicsOutputDto } from "@/api/types";

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
}

const FilterSidebarComponent = ({
  filters,
  onFilterChange,
  onClose,
}: FilterSidebarProps) => {
  const [categories, setCategories] = useState<TopicsOutputDto[]>([]);
  const [restrictedTopicsOptions, setRestrictedTopicsOptions] = useState<
    TopicsOutputDto[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загружаем категории и запрещенные тематики из API
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Загружаем обычные тематики (категории)
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);

        // Загружаем запрещенные тематики
        const restrictedTopicsData = await getAllRestrictedTopics();
        setRestrictedTopicsOptions(restrictedTopicsData);
      } catch (error) {
        logError("Error loading filter data:", error);
        setError("Ошибка загрузки тематик. Попробуйте обновить страницу.");
        // В случае ошибки используем пустые массивы
        setCategories([]);
        setRestrictedTopicsOptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadFilterData();
  }, []);

  const updateFilter = useCallback(
    (key: keyof FilterState, value: string | boolean) => {
      onFilterChange({ ...filters, [key]: value });
    },
    [filters, onFilterChange],
  );

  const resetFilters = useCallback(() => {
    onFilterChange(DEFAULT_FILTER_STATE);
  }, [onFilterChange]);

  const categoryOptions = categories.map((category) => (
    <SelectItem key={category.id} value={category.name}>
      {category.name}
    </SelectItem>
  ));

  const restrictedTopicsOptionsList = restrictedTopicsOptions.map((topic) => (
    <SelectItem key={topic.id} value={topic.name}>
      {topic.name}
    </SelectItem>
  ));

  return (
    <div className="w-80 bg-card border-r border-border-light h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Фильтры</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Сбросить все фильтры"
          >
            <RotateCcw className="w-4 h-4 mr-1" aria-hidden="true" />
            Сбросить
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form
          className="space-y-6"
          role="search"
          aria-label="Фильтры поиска блогеров"
        >
          {/* Search */}
          <fieldset className="filter-section">
            <Label htmlFor="search" className="text-sm font-medium mb-2 block">
              Поиск блогеров
            </Label>
            <Input
              id="search"
              placeholder="Имя или @username"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="w-full"
              aria-describedby="search-help"
            />
            <div
              id="search-help"
              className="text-xs text-muted-foreground mt-1"
            >
              Введите имя или username блогера для поиска
            </div>
          </fieldset>

          {/* Gender */}
          <fieldset className="filter-section">
            <Label
              htmlFor="gender-select"
              className="text-sm font-medium mb-2 block"
            >
              Пол блогера
            </Label>
            <Select
              value={filters.gender}
              onValueChange={(value) => updateFilter("gender", value)}
            >
              <SelectTrigger id="gender-select" aria-describedby="gender-help">
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="мужчина">Мужчина</SelectItem>
                <SelectItem value="женщина">Женщина</SelectItem>
                <SelectItem value="пара">Пара</SelectItem>
                <SelectItem value="паблик">Паблик</SelectItem>
              </SelectContent>
            </Select>
            <div
              id="gender-help"
              className="text-xs text-muted-foreground mt-1"
            >
              Выберите пол блогера для фильтрации
            </div>
          </fieldset>

          {/* Category */}
          <div className="filter-section">
            <Label className="text-sm font-medium mb-2 block">
              Тематика блога
            </Label>
            <Select
              value={filters.category}
              onValueChange={(value) => updateFilter("category", value)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={loading ? "Загрузка..." : "Выберите тематику"}
                />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Загрузка тематик...</span>
                    </div>
                  </SelectItem>
                ) : (
                  categoryOptions
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Followers */}
          <div className="filter-section">
            <Label className="text-sm font-medium mb-2 block">
              Подписчиков
            </Label>
            <div className="flex space-x-2">
              <Input
                placeholder="От"
                value={filters.followersMin}
                onChange={(e) => updateFilter("followersMin", e.target.value)}
                type="number"
              />
              <Input
                placeholder="До"
                value={filters.followersMax}
                onChange={(e) => updateFilter("followersMax", e.target.value)}
                type="number"
              />
            </div>
          </div>

          {/* Post Price */}
          <div className="filter-section">
            <Label className="text-sm font-medium mb-2 block">
              Цена поста - BYN
            </Label>
            <div className="flex space-x-2">
              <Input
                placeholder="От"
                value={filters.postPriceMin}
                onChange={(e) => updateFilter("postPriceMin", e.target.value)}
                type="number"
              />
              <Input
                placeholder="До"
                value={filters.postPriceMax}
                onChange={(e) => updateFilter("postPriceMax", e.target.value)}
                type="number"
              />
            </div>
          </div>

          {/* Story Price */}
          <div className="filter-section">
            <Label className="text-sm font-medium mb-2 block">
              Цена сторис - BYN
            </Label>
            <div className="flex space-x-2">
              <Input
                placeholder="От"
                value={filters.storyPriceMin}
                onChange={(e) => updateFilter("storyPriceMin", e.target.value)}
                type="number"
              />
              <Input
                placeholder="До"
                value={filters.storyPriceMax}
                onChange={(e) => updateFilter("storyPriceMax", e.target.value)}
                type="number"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="filter-section">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="barter"
                  checked={filters.allowsBarter}
                  onCheckedChange={(checked) =>
                    updateFilter("allowsBarter", checked)
                  }
                />
                <Label htmlFor="barter" className="text-sm">
                  Возможен бартер
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mart"
                  checked={filters.inMartRegistry}
                  onCheckedChange={(checked) =>
                    updateFilter("inMartRegistry", checked)
                  }
                />
                <Label htmlFor="mart" className="text-sm">
                  Есть в реестре МАРТ
                </Label>
              </div>
            </div>
          </div>

          {/* Restricted Topics */}
          <fieldset className="filter-section">
            <Label className="text-sm font-medium mb-2 block">
              Запрещенные тематики
            </Label>
            <Select
              value={filters.restrictedTopics}
              onValueChange={(value) => updateFilter("restrictedTopics", value)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={loading ? "Загрузка..." : "Выберите тематику"}
                />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Загрузка тематик...</span>
                    </div>
                  </SelectItem>
                ) : (
                  restrictedTopicsOptionsList
                )}
              </SelectContent>
            </Select>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

// Export the memoized component
export const FilterSidebar = memo(FilterSidebarComponent);
