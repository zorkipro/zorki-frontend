import { Input, Label, Button, Checkbox, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui-kit";
import { FilterState } from "@/types/blogger";
import { RotateCcw } from "lucide-react";
import { DEFAULT_FILTER_STATE } from "@/config/filters";
import { useTopics } from "@/hooks/useTopics";
import { useCallback } from "react";

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
}

export const FilterSidebar = ({ filters, onFilterChange }: FilterSidebarProps) => {
  const { categories, restrictedTopics, loading } = useTopics();
  
  const updateFilter = useCallback((key: keyof FilterState, value: unknown) => {
    onFilterChange({ ...filters, [key]: value });
  }, [filters, onFilterChange]);

  return (
    <div className="w-full lg:w-80 bg-card border-r border-border-light">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Фильтры</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(DEFAULT_FILTER_STATE)}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Сбросить
          </Button>
        </div>

        <form className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">Поиск блогеров</Label>
            <Input
              placeholder="Имя или @username"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Пол блогера</Label>
            <Select value={filters.gender} onValueChange={(value) => updateFilter("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выбрать" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="мужчина">Мужчина</SelectItem>
                <SelectItem value="женщина">Женщина</SelectItem>
                <SelectItem value="пара">Пара</SelectItem>
                <SelectItem value="паблик">Паблик</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Тематика блога</Label>
            <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Загрузка..." : "Выбрать"} />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>Загрузка...</SelectItem>
                ) : (
                  categories.map((item) => (
                    <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Подписчиков</Label>
            <div className="flex gap-2">
              <Input
                placeholder="От"
                value={filters.followersMin}
                onChange={(e) => updateFilter("followersMin", e.target.value)}
                type="number"
                className="flex-1 min-w-0"
              />
              <Input
                placeholder="До"
                value={filters.followersMax}
                onChange={(e) => updateFilter("followersMax", e.target.value)}
                type="number"
                className="flex-1 min-w-0"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Цена поста - BYN</Label>
            <div className="flex gap-2">
              <Input
                placeholder="От"
                value={filters.postPriceMin}
                onChange={(e) => updateFilter("postPriceMin", e.target.value)}
                type="number"
                className="flex-1 min-w-0"
              />
              <Input
                placeholder="До"
                value={filters.postPriceMax}
                onChange={(e) => updateFilter("postPriceMax", e.target.value)}
                type="number"
                className="flex-1 min-w-0"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Цена сторис - BYN</Label>
            <div className="flex gap-2">
              <Input
                placeholder="От"
                value={filters.storyPriceMin}
                onChange={(e) => updateFilter("storyPriceMin", e.target.value)}
                type="number"
                className="flex-1 min-w-0"
              />
              <Input
                placeholder="До"
                value={filters.storyPriceMax}
                onChange={(e) => updateFilter("storyPriceMax", e.target.value)}
                type="number"
                className="flex-1 min-w-0"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filters.allowsBarter}
                onCheckedChange={(checked) => updateFilter("allowsBarter", !!checked)}
              />
              <Label className="text-sm">Возможен бартер</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filters.inMartRegistry}
                onCheckedChange={(checked) => updateFilter("inMartRegistry", !!checked)}
              />
              <Label className="text-sm">Есть в реестре МАРТ</Label>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Запрещенные тематики</Label>
            <Select value={filters.restrictedTopics} onValueChange={(value) => updateFilter("restrictedTopics", value)}>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Загрузка..." : "Выбрать"} />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>Загрузка...</SelectItem>
                ) : (
                  restrictedTopics.map((item) => (
                    <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>
    </div>
  );
};
