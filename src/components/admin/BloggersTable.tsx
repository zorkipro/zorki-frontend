import React, { useEffect, useRef } from "react";
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
import { Eye, EyeOff, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SafeAvatar } from "@/components/ui/SafeAvatar";
import { truncateName } from "@/utils/formatters";
import { formatLargeNumber } from "@/api/types";
import type { AdminGetBloggerOutputDto } from "@/api/types";
import { logger } from "@/utils/logger";
import { getStatusColor, getStatusText } from "@/utils/admin/status";
import { prepareBloggerData } from "@/utils/admin/blogger";

interface BloggersTableProps {
  bloggers: AdminGetBloggerOutputDto[];
  onToggleVisibility: (id: number, currentVisibility: boolean) => void;
  formatNumber: (num: number) => string;
  searchLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  totalCount?: number;
}

export const BloggersTable: React.FC<BloggersTableProps> = ({
  bloggers,
  onToggleVisibility,
  formatNumber,
  searchLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  totalCount = 0,
}) => {
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer для автоматической подгрузки
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore && onLoadMore) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  // Функция для рендера мобильной карточки
  const renderMobileCard = (blogger: AdminGetBloggerOutputDto) => {
    const { mainSocial, displayName, username, subscribers } =
      prepareBloggerData(blogger);

    return (
      <Card 
        key={blogger.id} 
        className="mb-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => {
          // Используем username из социальных аккаунтов для навигации
          const mainSocial = blogger.social.find(
            (s) => s.type === "INSTAGRAM",
          );
          const username = mainSocial?.username;

          if (username) {
            navigate(`/admin/blogger/${username}/edit`);
          } else {
            logger.error(
              "Username not found for blogger",
              undefined,
              {
                component: "BloggersTable",
                bloggerId: blogger.id,
              },
            );
          }
        }}
      >
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

              {/* Status and Followers */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${getStatusColor(blogger.status)}`}
                  ></div>
                  <span>{getStatusText(blogger.status)}</span>
                </div>
                <div className="flex items-center gap-1">
                  {!blogger.isHidden ? (
                    <Eye className="w-3 h-3 text-green-500" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-gray-500" />
                  )}
                  <span>{!blogger.isHidden ? "Виден" : "Скрыт"}</span>
                </div>
                <span className="font-medium">
                  {formatLargeNumber(subscribers)}
                </span>
              </div>
            </div>

            {/* Visibility Toggle Button - Top Right Corner */}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(blogger.id, blogger.isHidden);
              }}
            >
              {!blogger.isHidden ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Блогеры</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead className="text-center">Подписчиков</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Видимость</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-muted-foreground">
                        Поиск блогеров...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : bloggers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="text-muted-foreground">
                      Блогеры не найдены
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                bloggers.map((blogger) => {
                  const { mainSocial, displayName, username, subscribers } =
                    prepareBloggerData(blogger);

                  return (
                    <TableRow
                      key={blogger.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        // Используем username из социальных аккаунтов для навигации
                        const mainSocial = blogger.social.find(
                          (s) => s.type === "INSTAGRAM",
                        );
                        const username = mainSocial?.username;

                        if (username) {
                          navigate(`/admin/blogger/${username}/edit`);
                        } else {
                          logger.error(
                            "Username not found for blogger",
                            undefined,
                            {
                              component: "BloggersTable",
                              bloggerId: blogger.id,
                            },
                          );
                        }
                      }}
                    >
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
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${getStatusColor(blogger.status)}`}
                          ></div>
                          <span className="text-sm">
                            {getStatusText(blogger.status)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {!blogger.isHidden ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="text-sm">
                            {!blogger.isHidden ? "Виден" : "Скрыт"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleVisibility(blogger.id, blogger.isHidden);
                            }}
                          >
                            {!blogger.isHidden ? (
                              <EyeOff className="w-4 h-4 mr-1" />
                            ) : (
                              <Eye className="w-4 h-4 mr-1" />
                            )}
                            {!blogger.isHidden ? "Скрыть" : "Показать"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Load More Indicator for Desktop */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center mt-4 py-4">
              {isLoadingMore ? (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Загрузка...</span>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Прокрутите вниз для загрузки
                </div>
              )}
            </div>
          )}

          {/* Pagination Info */}
          <div className="text-center text-sm text-muted-foreground mt-2">
            Показано {bloggers.length} из {totalCount} блогеров
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {bloggers.map((blogger) => renderMobileCard(blogger))}

          {/* Load More Indicator for Mobile */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center mt-4 py-4">
              {isLoadingMore ? (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Загрузка...</span>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Прокрутите вниз для загрузки
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
