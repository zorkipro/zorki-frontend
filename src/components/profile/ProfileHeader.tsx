import React, { useState, useMemo } from "react";
import { Badge } from "@/ui-kit";
import { Button } from "@/ui-kit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui-kit";
import { Input } from "@/ui-kit";
import { Label } from "@/ui-kit";
import { Textarea } from "@/ui-kit";
import { Edit, ArrowLeft, MessageCircle, Copy, Check, AlertTriangle } from "lucide-react";
import { Instagram } from "lucide-react";
import { type Blogger } from "@/types/blogger";
import { SafeAvatar } from "@/components/ui/SafeAvatar";
import { truncateName } from "@/utils/formatters";
import {
  useProfileBasicInfo,
  useVerificationStatus,
} from "@/hooks/profile/useProfileSelectors";
import { useBlogger } from "@/contexts/BloggerContext";
import { useTopics } from "@/hooks/useTopics";

import { EditData } from "@/types/profile";
import { normalizeUsername } from "@/utils/username";

interface ProfileHeaderProps {
  profile: Blogger;
  formData: EditData;
  editingSection: string | null;
  onEditingSectionChange: (section: string | null) => void;
  handleSave: (data: Partial<EditData>) => void;
  saving: boolean;
  onBack?: () => void;
  onFormDataChange?: (data: Partial<EditData>) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = React.memo(
  ({
    profile,
    formData,
    editingSection,
    onEditingSectionChange,
    handleSave,
    saving,
    onBack,
    onFormDataChange,
  }) => {
    const { bloggerInfo } = useBlogger();

    // Получаем lookup таблицы для конвертации ID в названия
    const { topicReverseLookup } = useTopics();

    // Используем селекторы для оптимизированного доступа к данным
    const basicInfo = useProfileBasicInfo(bloggerInfo);
    const verificationStatus = useVerificationStatus(bloggerInfo);

    // Состояние для полей редактирования
    const [editName, setEditName] = useState(formData?.full_name || "");
    const [editDescription, setEditDescription] = useState(
      formData?.description || "",
    );
    // Состояние для копирования ссылки
    const [isCopied, setIsCopied] = useState(false);
    // Состояние для модального окна предупреждения
    const [showWarningDialog, setShowWarningDialog] = useState(false);
    // Ref для хранения ID таймаута
    const copyTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    // Мемоизированные значения для предотвращения ненужных перерисовок
    const displayName = useMemo(() => {
      return basicInfo
        ? `${basicInfo.name || ""} ${basicInfo.lastName || ""}`.trim() ||
            basicInfo.username
        : profile.name;
    }, [
      basicInfo?.name,
      basicInfo?.lastName,
      basicInfo?.username,
      profile.name,
    ]);

    const avatarUrl = useMemo(() => {
      return profile.avatar; // Используем данные из profile, так как basicInfo не содержит avatar
    }, [profile.avatar]);

    const description = useMemo(() => {
      return profile.promoText; // Используем данные из profile, так как basicInfo не содержит description
    }, [profile.promoText]);

    // Обновляем состояние при изменении formData
    React.useEffect(() => {
      setEditName(formData?.full_name || "");
      setEditDescription(formData?.description || "");
    }, [formData?.full_name, formData?.description]);

    // Очищаем таймаут при размонтировании
    React.useEffect(() => {
      return () => {
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }
      };
    }, []);

    // Функция для копирования ссылки на медиа-кит
    const copyMediaKitLink = React.useCallback(async () => {
      const username = basicInfo?.username || profile.handle;
      if (!username) {
        return;
      }

      const normalizedUsername = normalizeUsername(username);
      const mediaKitUrl = `${window.location.origin}/_${normalizedUsername}`;

      try {
        await navigator.clipboard.writeText(mediaKitUrl);
        setIsCopied(true);
        setShowWarningDialog(false); // Закрываем диалог после копирования
        
        // Очищаем предыдущий таймаут, если он есть
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }
        
        // Возвращаем кнопку в исходное состояние через 2 секунды
        copyTimeoutRef.current = setTimeout(() => {
          setIsCopied(false);
          copyTimeoutRef.current = null;
        }, 2000);
      } catch (error) {
        // В случае ошибки можно показать ошибку, но пока просто игнорируем
      }
    }, [basicInfo?.username, profile.handle]);

    // Функция-обработчик клика на кнопку
    const handleCopyMediaKitLink = React.useCallback(() => {
      // Проверяем статус верификации
      const isVerified = verificationStatus?.isVerified;
      
      if (!isVerified) {
        // Если не верифицирован - показываем предупреждение
        setShowWarningDialog(true);
      } else {
        // Если верифицирован - копируем сразу
        copyMediaKitLink();
      }
    }, [verificationStatus?.isVerified, copyMediaKitLink]);

    return (
      <div className="bg-card border-b border-border-light">
        <div className="container mx-auto px-4 py-6">
          {/* Back Button */}
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />К списку блогеров
            </Button>
          )}

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 flex-1">
              {/* Avatar */}
              <SafeAvatar
                src={avatarUrl}
                alt={displayName}
                className="w-32 h-32 border-4 border-border-light aspect-square"
                fallbackIcon={
                  <Instagram className="w-16 h-16 text-muted-foreground" />
                }
              />

              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
                  {/* Editable Name */}
                  <Dialog
                    open={editingSection === "fullName"}
                    onOpenChange={(open) => {
                      const newSection = open ? "fullName" : null;
                      onEditingSectionChange(newSection);
                    }}
                  >
                    <DialogTrigger asChild>
                      <div className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 rounded px-2 py-1">
                        <h1
                          className="text-3xl md:text-4xl font-bold text-foreground"
                          title={formData?.full_name || displayName}
                        >
                          {truncateName(formData?.full_name || displayName, 40)}
                        </h1>
                        <Edit className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Редактировать имя</DialogTitle>
                        <DialogDescription>
                          Обновите отображаемое имя в вашем профиле
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit_display_name">
                            Отображаемое имя
                          </Label>
                          <Input
                            id="edit_display_name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Ваше имя"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              onEditingSectionChange(null);
                            }}
                          >
                            Отмена
                          </Button>
                          <Button
                            onClick={async () => {
                              const newData = { full_name: editName };
                              try {
                                await handleSave(newData);
                                onFormDataChange?.(newData);
                                onEditingSectionChange(null);
                              } catch (error) {
                                // Ошибка сохранения имени
                              }
                            }}
                            disabled={saving}
                          >
                            Сохранить
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {verificationStatus && (
                    <Badge
                      variant={
                        verificationStatus.isVerified
                          ? "default"
                          : "destructive"
                      }
                      className={
                        verificationStatus.isVerified
                          ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                          : "bg-red-100 text-red-800 border-red-200"
                      }
                    >
                      {verificationStatus.isVerified
                        ? "Верифицирован"
                        : "Не верифицирован"}
                    </Badge>
                  )}
                </div>

                {/* Editable Bio */}
                <Dialog
                  open={editingSection === "description"}
                  onOpenChange={(open) => {
                    const newSection = open ? "description" : null;
                    onEditingSectionChange(newSection);
                  }}
                >
                  <DialogTrigger asChild>
                    <div className="flex items-start space-x-2 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 mb-4">
                      <p className="text-lg text-muted-foreground max-w-2xl">
                        {formData?.description ||
                          description ||
                          "Нажмите, чтобы добавить описание профиля..."}
                      </p>
                      <Edit className="w-4 h-4 text-muted-foreground mt-1" />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Редактировать описание</DialogTitle>
                      <DialogDescription>
                        Обновите описание вашего профиля
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="edit_bio">Описание профиля</Label>
                        <Textarea
                          id="edit_bio"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Расскажите о себе и своем контенте..."
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            onEditingSectionChange(null);
                          }}
                        >
                          Отмена
                        </Button>
                        <Button
                          onClick={async () => {
                            const newData = { description: editDescription };
                            try {
                              await handleSave(newData);
                              onFormDataChange?.(newData);
                              onEditingSectionChange(null);
                            } catch (error) {
                              // Ошибка сохранения описания
                            }
                          }}
                          disabled={saving}
                        >
                          Сохранить
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Предупреждение о неверификации */}
                {profile.verificationStatus && profile.verificationStatus !== "APPROVED" && (
                  <div className="mb-3 flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      Ваш профиль не верифицирован.{" "}
                      <a
                        href="https://www.instagram.com/zorki.pro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-yellow-900 underline hover:text-yellow-950 transition-colors"
                      >
                        Напишите администратору
                      </a>
                      , чтобы ваша страница стала видна публично.
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {basicInfo?.username && (
                    <Badge variant="secondary">
                      @{normalizeUsername(basicInfo.username)}
                    </Badge>
                  )}
                  {formData?.topics &&
                    formData.topics.length > 0 &&
                    formData.topics.map((topic, index) => {
                      // Конвертируем строковые ID в числовые для lookup
                      const numericId = typeof topic === 'string' ? parseInt(topic, 10) : topic;
                      const topicName = typeof numericId === 'number' ? topicReverseLookup[numericId] : topic;

                      return topicName ? (
                        <Badge key={index} variant="secondary">
                          {topicName}
                        </Badge>
                      ) : null;
                    })}
                  {formData?.barter_available && (
                    <Badge variant="secondary">Бартер возможен</Badge>
                  )}
                  {formData?.mart_registry && (
                    <Badge
                      variant="secondary"
                      className="text-success border-success"
                    >
                      В реестре МАРТ
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              {/* Copy Media Kit Link Button */}
              {(basicInfo?.username || profile.handle) && (
                <>
                  <Button
                    variant={isCopied ? "default" : "outline"}
                    className={`w-full md:w-auto ${
                      isCopied ? "bg-green-500 hover:bg-green-600" : ""
                    } ${!verificationStatus?.isVerified ? "relative" : ""}`}
                    onClick={handleCopyMediaKitLink}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Ссылка скопирована!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Скопировать ссылку на медиа-кит
                        {!verificationStatus?.isVerified && (
                          <AlertTriangle className="w-3 h-3 ml-2 text-yellow-500" />
                        )}
                      </>
                    )}
                  </Button>

                  {/* Предупреждающий диалог для неверифицированных блогеров */}
                  <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          Ваш профиль еще не виден публично
                        </DialogTitle>
                        <DialogDescription>
                          Ваш профиль находится на модерации и пока не доступен для просмотра неавторизованным пользователям.
                          <br />
                          <br />
                          Вы можете скопировать ссылку на медиа-кит заранее, но она будет доступна только после одобрения администратором.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => setShowWarningDialog(false)}
                        >
                          Отмена
                        </Button>
                        <Button onClick={copyMediaKitLink}>
                          <Copy className="w-4 h-4 mr-2" />
                          Все равно скопировать
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}

              {/* Contact Button */}
              {formData?.contact_link ? (
                <Button
                  className="bg-gradient-primary hover:bg-primary-hover w-full md:w-auto"
                  onClick={() => {
                    window.open(formData.contact_link!, "_blank");
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Связаться
                </Button>
              ) : (
                <Button
                  className="bg-gradient-primary hover:bg-primary-hover w-full md:w-auto opacity-50 cursor-not-allowed"
                  disabled
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Нет контакта
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
  // Кастомная функция сравнения для оптимизации перерисовок
  (prevProps, nextProps) => {
    // Сравниваем только критически важные пропсы
    return (
      prevProps.profile.id === nextProps.profile.id &&
      prevProps.formData?.full_name === nextProps.formData?.full_name &&
      prevProps.formData?.description === nextProps.formData?.description &&
      prevProps.editingSection === nextProps.editingSection &&
      prevProps.saving === nextProps.saving
    );
  },
);

ProfileHeader.displayName = "ProfileHeader";
