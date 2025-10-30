import React, { useReducer, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/ui-kit';
import { Button } from '@/ui-kit';
import { Input } from '@/ui-kit';
import { Label } from '@/ui-kit';
import { Textarea } from '@/ui-kit';
import { Badge } from '@/ui-kit';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui-kit';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui-kit';
import { Edit, CheckCircle, MessageCircle } from 'lucide-react';
import { EditData } from '@/types/profile';
import { CategorySelector } from '@/components/profile/CategorySelector';
import { RestrictedTopicsSelector } from '@/components/profile/RestrictedTopicsSelector';
import { bloggerInfoReducer, createInitialState, stateToEditData } from './BloggerInfo.reducer';
import { useTopics } from '@/hooks/useTopics';

// Опции для правовой формы
const legalFormOptions = [
  { value: 'ИП', label: 'ИП' },
  { value: 'профдоход', label: 'Профдоход' },
  { value: 'договор подряда', label: 'Договор подряда' },
  { value: 'ООО', label: 'ООО' },
];

// Опции для пола
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

export const BloggerInfo: React.FC<BloggerInfoProps> = React.memo(
  ({ formData, editingSection, saving, onEditingChange, onSave }) => {
    // Получаем темы и lookup таблицы
    const { topicLookup, topicReverseLookup, loading: topicsLoading } = useTopics();
    
    // Используем useMemo для создания начального состояния только при изменении formData
    const initialState = useMemo(() => {
      return createInitialState(formData);
    }, [formData]);

    // Заменяем 7 useState на один useReducer
    const [state, dispatch] = useReducer(bloggerInfoReducer, initialState);

    // Синхронизируем state с formData при изменении formData извне
    useEffect(() => {
      dispatch({ type: 'LOAD_FROM_FORM_DATA', payload: formData });
    }, [formData]);

    const handleSave = useCallback(() => {
      const editData = stateToEditData(state);
      
      // Передаем данные как есть - конвертация будет в mapLocalToApiUpdate
      onSave(editData);
      onEditingChange(null);
    }, [state, onSave, onEditingChange]);

    const handleCancel = useCallback(() => {
      dispatch({ type: 'RESET_TO_INITIAL', payload: initialState });
      onEditingChange(null);
    }, [initialState, onEditingChange]);

    return (
      <Card className="relative">
        <CardContent className="p-4">
          <div className="absolute top-2 right-2">
            <Dialog
              open={editingSection === 'blogger_info'}
              onOpenChange={(open) => onEditingChange(open ? 'blogger_info' : null)}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Редактировать информацию о блогере</DialogTitle>
                  <DialogDescription>Обновите основную информацию о профиле</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Правовая форма */}
                  <div>
                    <Label htmlFor="legal_form">Правовая форма</Label>
                    <Select
                      value={state.legalForm}
                      onValueChange={(value: string) =>
                        dispatch({ type: 'SET_LEGAL_FORM', payload: value })
                      }
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

                  {/* Пол */}
                  <div>
                    <Label htmlFor="gender">Пол</Label>
                    <Select
                      value={state.gender}
                      onValueChange={(value: string) =>
                        dispatch({ type: 'SET_GENDER', payload: value })
                      }
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

                  {/* Контактная ссылка */}
                  <div>
                    <Label htmlFor="contact_url">Контакт для связи</Label>
                    <Input
                      id="contact_url"
                      value={state.contactUrl}
                      onChange={(e) =>
                        dispatch({ type: 'SET_CONTACT_URL', payload: e.target.value })
                      }
                      placeholder="https://t.me/username или ссылка на WhatsApp"
                    />
                  </div>


                  {/* Категории */}
                  <div>
                    <Label>Категории</Label>
                    {topicsLoading ? (
                      <div className="flex items-center justify-center p-3 text-sm text-muted-foreground">
                        Загрузка тематик...
                      </div>
                    ) : (
                      <CategorySelector
                        value={state.categories.map(topic => {
                          // Конвертируем строковые ID в числовые для lookup
                          const numericId = typeof topic === 'string' ? parseInt(topic, 10) : topic;
                          const name = typeof numericId === 'number' ? topicReverseLookup[numericId] : topic;
                          return name || '';
                        }).filter(Boolean) as string[]}
                        onChange={(categories) =>
                          dispatch({ type: 'SET_CATEGORIES', payload: categories })
                        }
                      />
                    )}
                  </div>

                  {/* Запрещенные темы */}
                  <div>
                    <Label>Запрещенные темы</Label>
                    {topicsLoading ? (
                      <div className="flex items-center justify-center p-3 text-sm text-muted-foreground">
                        Загрузка запрещенных тематик...
                      </div>
                    ) : (
                      <RestrictedTopicsSelector
                        value={state.restrictedTopics.map(topic => {
                          // Конвертируем строковые ID в числовые для lookup
                          const numericId = typeof topic === 'string' ? parseInt(topic, 10) : topic;
                          const name = typeof numericId === 'number' ? topicReverseLookup[numericId] : topic;
                          return name || '';
                        }).filter(Boolean) as string[]}
                        onChange={(topics) =>
                          dispatch({ type: 'SET_RESTRICTED_TOPICS', payload: topics })
                        }
                      />
                    )}
                  </div>

                  {/* Дополнительные опции */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="barter_available"
                        checked={state.barterAvailable}
                        onChange={(e) =>
                          dispatch({ type: 'SET_BARTER_AVAILABLE', payload: e.target.checked })
                        }
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="barter_available">Доступен бартер</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="mart_registry"
                        checked={state.martRegistry}
                        onChange={(e) =>
                          dispatch({ type: 'SET_MART_REGISTRY', payload: e.target.checked })
                        }
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="mart_registry">В реестре МАРТ</Label>
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

          <h3 className="font-semibold mb-4">Информация о блогере</h3>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Правовая форма:</span>
              <Badge variant="secondary" className="ml-2">
                {formData.work_format || 'Не указано'}
              </Badge>
            </div>

            <div>
              <span className="text-sm text-muted-foreground">Пол:</span>
              <Badge variant="secondary" className="ml-2">
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

            {formData.topics && formData.topics.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">Категории:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.topics.map((topic) => {
                    // Конвертируем строковые ID в числовые для lookup
                    const numericId = typeof topic === 'string' ? parseInt(topic, 10) : topic;
                    const topicName = typeof numericId === 'number' ? topicReverseLookup[numericId] : topic;
                    
                    return topicName ? (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topicName}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {formData.banned_topics && formData.banned_topics.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">Запрещенные темы:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.banned_topics.map((topic) => {
                    // Конвертируем строковые ID в числовые для lookup
                    const numericId = typeof topic === 'string' ? parseInt(topic, 10) : topic;
                    const topicName = typeof numericId === 'number' ? topicReverseLookup[numericId] : topic;
                    
                    return topicName ? (
                      <Badge key={topic} variant="destructive" className="text-xs">
                        {topicName}
                      </Badge>
                    ) : (
                      <Badge key={topic} variant="destructive" className="text-xs">
                        Тема {topic}
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
  }
);

BloggerInfo.displayName = 'BloggerInfo';
