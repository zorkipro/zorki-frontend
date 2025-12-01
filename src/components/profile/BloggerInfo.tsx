import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Button, Input, Label, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Checkbox } from '@/ui-kit';
import { Edit, CheckCircle } from 'lucide-react';
import { EditData } from '@/types/profile';
import { CategorySelector } from '@/components/profile/CategorySelector';
import { RestrictedTopicsSelector } from '@/components/profile/RestrictedTopicsSelector';
import { useTopics } from '@/hooks/useTopics';
import { convertTopicIdsToNames, convertTopicNamesToIds } from '@/utils/topic-helpers';

const legalFormOptions = [
  { value: 'ИП', label: 'ИП' },
  { value: 'профдоход', label: 'Профдоход' },
  { value: 'договор подряда', label: 'Договор подряда' },
  { value: 'ООО', label: 'ООО' },
];

const genderOptions = [
  { value: 'мужчина', label: 'Мужчина' },
  { value: 'женщина', label: 'Женщина' },
  { value: 'пара', label: 'Пара' },
  { value: 'паблик', label: 'Паблик' },
];

interface BloggerInfoProps {
  formData: EditData;
  editingSection: string | null;
  saving: boolean;
  onEditingChange: (section: string | null) => void;
  onSave: (data: Partial<EditData>) => void;
}

interface FormState {
  legalForm: string;
  gender: string;
  contactUrl: string;
  categories: number[];
  restrictedTopics: number[];
  barterAvailable: boolean;
  martRegistry: boolean;
}

const parseTopicIds = (topics: (string | number)[] | undefined): number[] => {
  return (topics || []).map(t => typeof t === 'string' ? parseInt(t, 10) : t);
};

export const BloggerInfo: React.FC<BloggerInfoProps> = ({ formData, editingSection, saving, onEditingChange, onSave }) => {
  const { 
    topicReverseLookup, 
    loading: topicsLoading,
    getCategoryIdByName,
    getRestrictedTopicIdByName,
    topicLookup,
  } = useTopics();
  
  const [state, setState] = useState<FormState>(() => ({
    legalForm: formData.work_format || "",
    gender: formData.gender_type || "",
    contactUrl: formData.contact_link || "",
    categories: parseTopicIds(formData.topics),
    restrictedTopics: parseTopicIds(formData.banned_topics),
    barterAvailable: formData.barter_available ?? false,
    martRegistry: formData.mart_registry ?? false,
  }));

  // Синхронизируем состояние с formData при открытии модального окна или изменении formData
  useEffect(() => {
    if (editingSection === 'blogger_info') {
      setState({
        legalForm: formData.work_format || "",
        gender: formData.gender_type || "",
        contactUrl: formData.contact_link || "",
        categories: parseTopicIds(formData.topics),
        restrictedTopics: parseTopicIds(formData.banned_topics),
        barterAvailable: formData.barter_available ?? false,
        martRegistry: formData.mart_registry ?? false,
      });
    }
  }, [editingSection, formData.work_format, formData.gender_type, formData.contact_link, formData.topics, formData.banned_topics, formData.barter_available, formData.mart_registry]);

    const handleSave = useCallback(() => {
      const editData: Partial<EditData> = {
        work_format: state.legalForm || undefined,
        gender_type: state.gender || undefined,
        contact_link: state.contactUrl || undefined,
        topics: state.categories,
        banned_topics: state.restrictedTopics,
        barter_available: state.barterAvailable,
        mart_registry: state.martRegistry,
      };
      onSave(editData);
      onEditingChange(null);
    }, [state, onSave, onEditingChange]);

    const handleCancel = useCallback(() => {
      setState({
        legalForm: formData.work_format || "",
        gender: formData.gender_type || "",
        contactUrl: formData.contact_link || "",
        categories: parseTopicIds(formData.topics),
        restrictedTopics: parseTopicIds(formData.banned_topics),
        barterAvailable: formData.barter_available ?? false,
        martRegistry: formData.mart_registry ?? false,
      });
      onEditingChange(null);
    }, [
      formData.work_format,
      formData.gender_type,
      formData.contact_link,
      formData.topics,
      formData.banned_topics,
      formData.barter_available,
      formData.mart_registry,
      onEditingChange,
    ]);

    return (
      <Card className="relative">
        <CardContent className="p-4 sm:p-5">
          <div className="absolute top-3 right-3">
            <Dialog
              open={editingSection === 'blogger_info'}
              onOpenChange={(open) => onEditingChange(open ? 'blogger_info' : null)}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Редактировать информацию о блогере</DialogTitle>
                  <DialogDescription>Обновите основную информацию о профиле</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="legal_form">Правовая форма</Label>
                    <Select
                      value={state.legalForm}
                      onValueChange={(value) => setState(prev => ({ ...prev, legalForm: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите правовую форму" />
                      </SelectTrigger>
                      <SelectContent>
                        {legalFormOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="gender">Пол</Label>
                    <Select
                      value={state.gender}
                      onValueChange={(value) => setState(prev => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите пол" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="contact_url">Контакт для связи</Label>
                    <Input
                      id="contact_url"
                      value={state.contactUrl}
                      onChange={(e) => setState(prev => ({ ...prev, contactUrl: e.target.value }))}
                      placeholder="https://t.me/username или ссылка на другой мессенджер"
                    />
                  </div>

                  <div>
                    <Label>Категории (максимум 3)</Label>
                    {topicsLoading ? (
                      <div className="flex items-center justify-center p-3 text-sm text-muted-foreground">
                        Загрузка тематик...
                      </div>
                    ) : (
                      <CategorySelector
                        maxItems={3}
                        value={convertTopicIdsToNames(state.categories, topicReverseLookup)}
                        onChange={(categoryNames) => {
                          const categoryIds = convertTopicNamesToIds(
                            categoryNames,
                            getCategoryIdByName,
                            topicLookup
                          );
                          setState(prev => ({ ...prev, categories: categoryIds }));
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <Label>Запрещенные темы</Label>
                    {topicsLoading ? (
                      <div className="flex items-center justify-center p-3 text-sm text-muted-foreground">
                        Загрузка запрещенных тематик...
                      </div>
                    ) : (
                      <RestrictedTopicsSelector
                        value={convertTopicIdsToNames(state.restrictedTopics, topicReverseLookup)}
                        onChange={(topicNames) => {
                          const topicIds = convertTopicNamesToIds(
                            topicNames,
                            getRestrictedTopicIdByName,
                            topicLookup
                          );
                          setState(prev => ({ ...prev, restrictedTopics: topicIds }));
                        }}
                      />
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="barter_available"
                        checked={state.barterAvailable}
                        onCheckedChange={(checked) =>
                          setState(prev => ({ ...prev, barterAvailable: !!checked }))
                        }
                      />
                      <Label htmlFor="barter_available" className="cursor-pointer">
                        Доступен бартер
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mart_registry"
                        checked={state.martRegistry}
                        onCheckedChange={(checked) =>
                          setState(prev => ({ ...prev, martRegistry: !!checked }))
                        }
                      />
                      <Label htmlFor="mart_registry" className="cursor-pointer">
                        В реестре МАРТ
                      </Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Отмена
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <h3 className="font-semibold mb-4 sm:mb-5 text-sm sm:text-base">Информация о блогере</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Правовая форма:</span>
              <Badge variant="secondary" className="text-xs">
                {formData.work_format || 'Не указано'}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Пол:</span>
              <Badge variant="secondary" className="text-xs">
                {formData.gender_type 
                  ? formData.gender_type.charAt(0).toUpperCase() + formData.gender_type.slice(1)
                  : 'Не указано'}
              </Badge>
            </div>

            {formData.contact_link && (
              <div>
                <span className="text-sm text-muted-foreground">Контакт:</span>
                <a
                  href={formData.contact_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline break-all"
                >
                  {formData.contact_link}
                </a>
              </div>
            )}

            {formData.topics?.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">Категории:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {convertTopicIdsToNames(formData.topics, topicReverseLookup).map((topicName, index) => (
                    <Badge key={formData.topics[index]} variant="outline" className="text-xs">
                      {topicName}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {formData.banned_topics?.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">Запрещенные темы:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.banned_topics.map((topic, index) => {
                    const topicName = convertTopicIdsToNames([topic], topicReverseLookup)[0] || `Тема ${topic}`;
                    return (
                      <Badge key={topic} variant="destructive" className="text-xs">
                        {topicName}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {formData.barter_available && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Бартер
                </Badge>
              )}
              {formData.mart_registry && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Реестр МАРТ
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
};
