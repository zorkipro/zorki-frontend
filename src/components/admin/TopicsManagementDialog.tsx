// ============================================
// Topics Management Dialog Component
// ============================================
// Модальное окно для управления топиками администратором
// Две вкладки: обычные топики и запрещенные топики
// CRUD операции: создание, редактирование, удаление
// ============================================

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Plus, Edit, Trash2, Calendar } from "lucide-react";
import { useAdminTopics } from "@/hooks/admin/useAdminTopics";
import type {
  TopicsOutputDto,
  AdminCreateTopicInputDto,
  AdminUpdateTopicInputDto,
} from "@/api/types";
import { toast } from "@/hooks/use-toast";

interface TopicsManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TopicFormData {
  name: string;
  isRestricted: boolean;
}

const INITIAL_FORM_DATA: TopicFormData = {
  name: "",
  isRestricted: false,
};

export const TopicsManagementDialog: React.FC<TopicsManagementDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const {
    loading,
    error,
    createTopicAction,
    updateTopicAction,
    deleteTopicAction,
    loadTopics,
    clearError,
  } = useAdminTopics();

  // Состояние топиков
  const [topics, setTopics] = useState<TopicsOutputDto[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  // Состояние формы
  const [formData, setFormData] = useState<TopicFormData>(INITIAL_FORM_DATA);
  const [editingTopic, setEditingTopic] = useState<TopicsOutputDto | null>(
    null,
  );
  const [showForm, setShowForm] = useState(false);

  // Состояние удаления
  const [deletingTopic, setDeletingTopic] = useState<TopicsOutputDto | null>(
    null,
  );

  // Загрузка топиков
  const loadAllTopics = async () => {
    try {
      setLoadingTopics(true);
      clearError();

      // Загружаем обычные и запрещенные топики
      const [normalResult, restrictedResult] = await Promise.all([
        loadTopics({ isRestricted: false, size: 50 }),
        loadTopics({ isRestricted: true, size: 50 }),
      ]);

      const allTopics = [...normalResult.items, ...restrictedResult.items];
      setTopics(allTopics);
    } catch (err) {
      toast({
        title: "Ошибка загрузки топиков",
        description: "Не удалось загрузить список топиков",
        variant: "destructive",
      });
    } finally {
      setLoadingTopics(false);
    }
  };

  // Загрузка при открытии диалога
  useEffect(() => {
    if (open) {
      loadAllTopics();
    }
  }, [open]);

  // Сброс формы
  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setEditingTopic(null);
    setShowForm(false);
  };

  // Открытие формы создания
  const handleCreateTopic = () => {
    resetForm();
    setShowForm(true);
  };

  // Открытие формы редактирования
  const handleEditTopic = (topic: TopicsOutputDto) => {
    setFormData({
      name: topic.name,
      isRestricted: topic.isRestricted,
    });
    setEditingTopic(topic);
    setShowForm(true);
  };

  // Отмена редактирования
  const handleCancelEdit = () => {
    resetForm();
  };

  // Сохранение топика
  const handleSaveTopic = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Ошибка валидации",
        description: "Название топика не может быть пустым",
        variant: "destructive",
      });
      return;
    }

    if (formData.name.length < 2 || formData.name.length > 40) {
      toast({
        title: "Ошибка валидации",
        description: "Название топика должно содержать от 2 до 40 символов",
        variant: "destructive",
      });
      return;
    }

    // Проверяем дубликаты только при создании нового топика
    if (!editingTopic) {
      const trimmedName = formData.name.trim();
      const existingTopic = topics.find(
        (topic) => topic.name.toLowerCase() === trimmedName.toLowerCase(),
      );

      if (existingTopic) {
        toast({
          title: "Ошибка валидации",
          description: `Топик "${trimmedName}" уже существует. Выберите другое название.`,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const topicData: AdminCreateTopicInputDto | AdminUpdateTopicInputDto = {
        name: formData.name.trim(),
        isRestricted: formData.isRestricted,
      };

      if (editingTopic) {
        await updateTopicAction(editingTopic.id, topicData);
        toast({
          title: "Топик обновлен",
          description: `Топик "${formData.name}" успешно обновлен`,
        });
      } else {
        await createTopicAction(topicData);
        toast({
          title: "Топик создан",
          description: `Топик "${formData.name}" успешно создан`,
        });
      }

      resetForm();
      await loadAllTopics();
    } catch (err) {
      // Показываем пользователю понятное сообщение об ошибке
      if (err instanceof Error) {
        if (err.message.includes("Topic already exist")) {
          toast({
            title: "Ошибка создания топика",
            description: `Топик "${formData.name}" уже существует. Выберите другое название.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Ошибка создания топика",
            description: err.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Ошибка создания топика",
          description: "Произошла неизвестная ошибка",
          variant: "destructive",
        });
      }
    }
  };

  // Подтверждение удаления
  const handleDeleteTopic = async () => {
    if (!deletingTopic) return;

    try {
      await deleteTopicAction(deletingTopic.id);
      toast({
        title: "Топик удален",
        description: `Топик "${deletingTopic.name}" успешно удален`,
      });
      setDeletingTopic(null);
      await loadAllTopics();
    } catch (err) {
      // Показываем пользователю понятное сообщение об ошибке
      if (err instanceof Error) {
        toast({
          title: "Ошибка удаления топика",
          description: err.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Ошибка удаления топика",
          description: "Произошла неизвестная ошибка",
          variant: "destructive",
        });
      }
    }
  };

  // Фильтрация топиков
  const normalTopics = topics.filter((topic) => !topic.isRestricted);
  const restrictedTopics = topics.filter((topic) => topic.isRestricted);

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Рендер списка топиков
  const renderTopicsList = (
    topicsList: TopicsOutputDto[],
    isRestricted: boolean,
  ) => (
    <div className="space-y-4">
      {topicsList.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {isRestricted
            ? "Запрещенных топиков пока нет"
            : "Обычных топиков пока нет"}
        </div>
      ) : (
        topicsList.map((topic) => (
          <Card key={topic.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{topic.name}</h3>
                    <Badge variant={isRestricted ? "destructive" : "default"}>
                      {isRestricted ? "Запрещенный" : "Обычный"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Создан: {formatDate(topic.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTopic(topic)}
                    disabled={loading}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingTopic(topic)}
                    disabled={loading}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Управление топиками</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col flex-1 min-h-0">
            {/* Форма создания/редактирования */}
            {showForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>
                    {editingTopic
                      ? "Редактировать топик"
                      : "Создать новый топик"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="topic-name">Название топика</Label>
                    <Input
                      id="topic-name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Введите название топика (2-40 символов)"
                      maxLength={40}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is-restricted"
                      checked={formData.isRestricted}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isRestricted: checked,
                        }))
                      }
                    />
                    <Label htmlFor="is-restricted">Запрещенный топик</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveTopic}
                      disabled={loading || !formData.name.trim()}
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingTopic ? "Обновить" : "Создать"}
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Вкладки с топиками */}
            <Tabs defaultValue="normal" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="normal">
                  Обычные топики ({normalTopics.length})
                </TabsTrigger>
                <TabsTrigger value="restricted">
                  Запрещенные топики ({restrictedTopics.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="normal"
                className="mt-4 flex-1 overflow-auto max-h-[400px]"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Обычные топики</h3>
                    <Button
                      onClick={handleCreateTopic}
                      disabled={loadingTopics}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Добавить топик
                    </Button>
                  </div>

                  {loadingTopics ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    renderTopicsList(normalTopics, false)
                  )}
                </div>
              </TabsContent>

              <TabsContent
                value="restricted"
                className="mt-4 flex-1 overflow-auto max-h-[400px]"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Запрещенные топики</h3>
                    <Button
                      onClick={handleCreateTopic}
                      disabled={loadingTopics}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Добавить топик
                    </Button>
                  </div>

                  {loadingTopics ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    renderTopicsList(restrictedTopics, true)
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <AlertDialog
        open={!!deletingTopic}
        onOpenChange={() => setDeletingTopic(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить топик "{deletingTopic?.name}"? Это
              действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTopic}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
