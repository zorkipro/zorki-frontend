import React, { useState } from "react";
import { Button } from "@/ui-kit";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui-kit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui-kit";
import { SafeAvatar } from "@/components/ui/SafeAvatar";
import { truncateName } from "@/utils/formatters";
import { formatLargeNumber } from "@/api/types";
import type { AdminBloggerWithGender } from "@/api/types";
import { logger } from "@/utils/logger";
import { prepareBloggerData } from "@/utils/admin/blogger";
import { adminUpdateBlogger } from "@/api/endpoints/admin";
import { useToast } from "@/hooks/use-toast";
import { GENDER_MAP, ApiGender } from "@/api/types";
import { Loader2 } from "lucide-react";

interface GenderSelectionTableProps {
  bloggers: AdminBloggerWithGender[];
  onGenderUpdated?: () => void;
  onBloggerGenderUpdated?: (bloggerId: number, genderType: ApiGender) => void;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  totalCount?: number;
  onClearCache?: () => void;
}

export const GenderSelectionTable: React.FC<GenderSelectionTableProps> = ({
  bloggers,
  onGenderUpdated,
  onBloggerGenderUpdated,
  loading = false,
  hasMore = false,
  onLoadMore,
  totalCount = 0,
  onClearCache,
}) => {
  const { toast } = useToast();
  const [updatingBloggerId, setUpdatingBloggerId] = useState<number | null>(null);

  // Функция для обновления пола блогера
  const handleGenderUpdate = async (
    bloggerId: number,
    genderType: ApiGender
  ) => {
    try {
      setUpdatingBloggerId(bloggerId);
      
      await adminUpdateBlogger(bloggerId, {
        genderType,
        topics: [], // Обязательные поля
        restrictedTopics: [], // Обязательные поля
      });

      toast({
        title: "Успех",
        description: `Пол блогера обновлен на "${GENDER_MAP[genderType]}"`,
        variant: "default",
      });

      // Локально обновляем состояние блогера
      if (onBloggerGenderUpdated) {
        onBloggerGenderUpdated(bloggerId, genderType);
      } else if (onGenderUpdated) {
        // Fallback к полной перезагрузке, если локальное обновление не предоставлено
        onGenderUpdated();
      }
    } catch (error) {
      logger.error("Error updating blogger gender:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить пол блогера",
        variant: "destructive",
      });
    } finally {
      setUpdatingBloggerId(null);
    }
  };

  if (bloggers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Выбор пола блогеров</CardTitle>
          <CardDescription>
            Все блогеры уже имеют выбранный пол
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Нет блогеров без указанного пола</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Выбор пола блогеров</CardTitle>
            <CardDescription>
              Быстрый выбор пола для блогеров без указанного пола. 
              Показано: {bloggers.length} из {totalCount} блогеров
            </CardDescription>
          </div>
          {onClearCache && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearCache}
              className="text-xs"
            >
              Очистить кэш
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Загрузка блогеров без пола...
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Блогер</TableHead>
                    <TableHead className="text-center">Подписчиков</TableHead>
                    <TableHead className="text-center">Выбор пола</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bloggers.map((blogger) => {
                    const { mainSocial, displayName, username, subscribers } =
                      prepareBloggerData(blogger);

                    return (
                      <TableRow key={blogger.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <SafeAvatar
                              src={mainSocial?.avatarUrl || ""}
                              alt={displayName}
                              className="w-8 h-8 aspect-square"
                              username={username}
                              gender="MALE"
                            />
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                <span title={displayName}>
                                  {truncateName(displayName, 25)}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                @{username}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="font-medium">
                            {formatLargeNumber(subscribers)}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex gap-1 justify-center">
                            {Object.entries(GENDER_MAP).map(([key, label]) => {
                              const genderKey = key as ApiGender;
                              const isUpdating = updatingBloggerId === blogger.id;
                              
                              return (
                                <Button
                                  key={genderKey}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs px-2 py-1 h-auto"
                                  disabled={isUpdating}
                                  onClick={() => handleGenderUpdate(blogger.id, genderKey)}
                                >
                                  {isUpdating ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    label
                                  )}
                                </Button>
                              );
                            })}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              {bloggers.map((blogger) => {
                const { mainSocial, displayName, username, subscribers } =
                  prepareBloggerData(blogger);

                return (
                  <Card key={blogger.id} className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <SafeAvatar
                            src={mainSocial?.avatarUrl || ""}
                            alt={displayName}
                            className="w-12 h-12 aspect-square"
                            username={username}
                            gender="MALE"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Name */}
                          <h3
                            className="font-medium text-sm truncate mb-1"
                            title={displayName}
                          >
                            {truncateName(displayName, 20)}
                          </h3>

                          {/* Username */}
                          <p className="text-xs text-muted-foreground mb-2">@{username}</p>

                          {/* Subscribers */}
                          <div className="text-xs text-muted-foreground mb-3">
                            {formatLargeNumber(subscribers)} подписчиков
                          </div>

                          {/* Gender Selection Buttons */}
                          <div className="flex gap-1 flex-wrap">
                            {Object.entries(GENDER_MAP).map(([key, label]) => {
                              const genderKey = key as ApiGender;
                              const isUpdating = updatingBloggerId === blogger.id;
                              
                              return (
                                <Button
                                  key={genderKey}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs px-2 py-1 h-auto"
                                  disabled={isUpdating}
                                  onClick={() => handleGenderUpdate(blogger.id, genderKey)}
                                >
                                  {isUpdating ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    label
                                  )}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
        
        {/* Кнопка загрузки следующей пачки */}
        {!loading && hasMore && onLoadMore && (
          <div className="text-center mt-6">
            <Button
              onClick={onLoadMore}
              variant="outline"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Загрузка...
                </>
              ) : (
                "Загрузить еще блогеров"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
