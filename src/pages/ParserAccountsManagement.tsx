import React, { useState, useEffect } from "react";
import { Button } from "@/ui-kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui-kit";
import { LoadingSpinner } from "@/ui-kit/components";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useParserAccounts } from "@/hooks/admin/useParserAccounts";
import { ParserAccountsTable } from "@/components/admin/parser/ParserAccountsTable";
import { AddInstagramAccountDialog } from "@/components/admin/parser/AddInstagramAccountDialog";
import { AddTelegramAccountDialog } from "@/components/admin/parser/AddTelegramAccountDialog";
import { AddYouTubeAccountDialog } from "@/components/admin/parser/AddYouTubeAccountDialog";
import { PlatformNotAvailableMessage } from "@/components/admin/parser/PlatformNotAvailableMessage";
import type { ParserPlatform } from "@/api/types";

const ParserAccountsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ParserPlatform>("INSTAGRAM");
  const [igAuthStatus, setIgAuthStatus] = useState<"active" | "inactive">("active");
  const [tgAuthStatus, setTgAuthStatus] = useState<"active" | "inactive">("active");
  
  const {
    // Instagram
    igAccounts,
    igLoading,
    igError,
    igHasMore,
    igTotalCount,
    fetchIgAccounts,
    loadMoreIgAccounts,
    addIgAccount,
    deleteIgAccount,
    logoutIgAccount,
    reauthIgAccount,
    
    // Telegram
    tgAccounts,
    tgLoading,
    tgError,
    tgHasMore,
    tgTotalCount,
    fetchTgAccounts,
    loadMoreTgAccounts,
    addTgAccount,
    confirmTgAccount,
    deleteTgAccount,
    logoutTgAccount,
    reauthTgAccount,
    
    // YouTube
    ytAccounts,
    ytLoading,
    ytError,
    ytHasMore,
    ytTotalCount,
    fetchYtAccounts,
    loadMoreYtAccounts,
    addYtAccount,
    deleteYtAccount,
    
    // General
    isProcessing,
  } = useParserAccounts();

  // Load accounts when tab changes
  useEffect(() => {
    if (activeTab === "INSTAGRAM") {
      fetchIgAccounts({ isAuthorized: igAuthStatus === "active" });
    } else if (activeTab === "TELEGRAM") {
      fetchTgAccounts({ isAuthorized: tgAuthStatus === "active" });
    } else if (activeTab === "YOUTUBE") {
      fetchYtAccounts();
    }
  }, [activeTab, igAuthStatus, tgAuthStatus, fetchIgAccounts, fetchTgAccounts, fetchYtAccounts]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as ParserPlatform);
  };

  const handleAddInstagram = async (username: string, password: string) => {
    await addIgAccount(username, password);
  };

  const handleAddTelegram = async (phone: string, apiHash: string, apiId: number) => {
    await addTgAccount(phone, apiHash, apiId);
  };

  const handleConfirmTelegram = async (phone: string, code: string) => {
    await confirmTgAccount(phone, code);
  };

  const handleDeleteInstagram = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот Instagram аккаунт?")) {
      await deleteIgAccount(id);
    }
  };

  const handleLogoutInstagram = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите отключить этот Instagram аккаунт?")) {
      await logoutIgAccount(id);
    }
  };

  const handleReauthInstagram = async (id: number, username: string, password: string) => {
    await reauthIgAccount(id, username, password);
  };

  const handleDeleteTelegram = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот Telegram аккаунт?")) {
      await deleteTgAccount(id);
    }
  };

  const handleLogoutTelegram = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите отключить этот Telegram аккаунт?")) {
      await logoutTgAccount(id);
    }
  };

  const handleReauthTelegram = async (id: number, phone: string, code: string) => {
    await reauthTgAccount(id, phone, code);
  };

  const handleAddYouTube = async (token: string, name: string) => {
    await addYtAccount(token, name);
  };

  const handleDeleteYouTube = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить эту YouTube сессию?")) {
      await deleteYtAccount(id);
    }
  };

  // Show loading spinner only for initial load
  if (
    (activeTab === "INSTAGRAM" && igLoading && igAccounts.length === 0) ||
    (activeTab === "TELEGRAM" && tgLoading && tgAccounts.length === 0) ||
    (activeTab === "YOUTUBE" && ytLoading && ytAccounts.length === 0)
  ) {
    return <LoadingSpinner fullScreen text="Загрузка аккаунтов парсера..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Admin Header */}
      <AdminHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Управление аккаунтами парсера
          </h1>
          <p className="text-gray-600">
            Добавление и управление аккаунтами для парсинга данных по каждой платформе
          </p>
        </div>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
          {/* Tabs Navigation */}
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto">
            <TabsTrigger value="INSTAGRAM" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-1">
              <span className="text-lg sm:text-base">📸</span>
              <span className="text-xs sm:text-sm font-medium">Instagram</span>
            </TabsTrigger>
            <TabsTrigger value="TELEGRAM" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-1">
              <span className="text-lg sm:text-base">✈️</span>
              <span className="text-xs sm:text-sm font-medium">Telegram</span>
            </TabsTrigger>
            <TabsTrigger value="YOUTUBE" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-1">
              <span className="text-lg sm:text-base">📺</span>
              <span className="text-xs sm:text-sm font-medium">YouTube</span>
            </TabsTrigger>
            <TabsTrigger value="TIKTOK" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-1">
              <span className="text-lg sm:text-base">🎵</span>
              <span className="text-xs sm:text-sm font-medium">TikTok</span>
            </TabsTrigger>
          </TabsList>

          {/* Instagram Tab */}
          <TabsContent value="INSTAGRAM" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-muted-foreground flex-1 min-w-0">
                <p className="hidden sm:block">
                  Управление Instagram аккаунтами для парсинга данных. 
                  Полностью функциональный с возможностью добавления, удаления и мониторинга активности.
                </p>
                <p className="sm:hidden">
                  Управление Instagram аккаунтами для парсинга данных.
                </p>
              </div>
              <div className="flex-shrink-0">
                <AddInstagramAccountDialog
                  onAddAccount={handleAddInstagram}
                  disabled={isProcessing}
                />
              </div>
            </div>

            {/* Instagram Auth Status Tabs */}
            <Tabs value={igAuthStatus} onValueChange={(v) => setIgAuthStatus(v as "active" | "inactive")} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 gap-1 h-auto">
                <TabsTrigger value="active" className="flex items-center space-x-2 py-2">
                  <span className="text-sm font-medium">Активные</span>
                </TabsTrigger>
                <TabsTrigger value="inactive" className="flex items-center space-x-2 py-2">
                  <span className="text-sm font-medium">Неактивные</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {igError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="text-sm text-red-600">
                      <strong>Ошибка:</strong> {igError}
                    </div>
                  </div>
                )}

                <ParserAccountsTable
                  accounts={igAccounts}
                  platform="INSTAGRAM"
                  loading={igLoading}
                  hasMore={igHasMore}
                  onLoadMore={() => loadMoreIgAccounts({ isAuthorized: true })}
                  onDelete={handleDeleteInstagram}
                  onLogout={handleLogoutInstagram}
                  totalCount={igTotalCount}
                />
              </TabsContent>

              <TabsContent value="inactive" className="space-y-4">
                {igError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="text-sm text-red-600">
                      <strong>Ошибка:</strong> {igError}
                    </div>
                  </div>
                )}

                <ParserAccountsTable
                  accounts={igAccounts}
                  platform="INSTAGRAM"
                  loading={igLoading}
                  hasMore={igHasMore}
                  onLoadMore={() => loadMoreIgAccounts({ isAuthorized: false })}
                  onDelete={handleDeleteInstagram}
                  onLogout={handleLogoutInstagram}
                  onReauth={handleReauthInstagram}
                  totalCount={igTotalCount}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Telegram Tab */}
          <TabsContent value="TELEGRAM" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-muted-foreground flex-1 min-w-0">
                <p className="hidden sm:block">
                  Управление Telegram аккаунтами для парсинга данных. 
                  Полностью функциональный с возможностью добавления, удаления и мониторинга активности.
                </p>
                <p className="sm:hidden">
                  Управление Telegram аккаунтами для парсинга данных.
                </p>
              </div>
              <div className="flex-shrink-0">
                <AddTelegramAccountDialog
                  onAddAccount={handleAddTelegram}
                  onConfirmAccount={handleConfirmTelegram}
                  disabled={isProcessing}
                />
              </div>
            </div>

            {/* Telegram Auth Status Tabs */}
            <Tabs value={tgAuthStatus} onValueChange={(v) => setTgAuthStatus(v as "active" | "inactive")} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 gap-1 h-auto">
                <TabsTrigger value="active" className="flex items-center space-x-2 py-2">
                  <span className="text-sm font-medium">Активные</span>
                </TabsTrigger>
                <TabsTrigger value="inactive" className="flex items-center space-x-2 py-2">
                  <span className="text-sm font-medium">Неактивные</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {tgError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="text-sm text-red-600">
                      <strong>Ошибка:</strong> {tgError}
                    </div>
                  </div>
                )}

                <ParserAccountsTable
                  accounts={tgAccounts}
                  platform="TELEGRAM"
                  loading={tgLoading}
                  hasMore={tgHasMore}
                  onLoadMore={() => loadMoreTgAccounts({ isAuthorized: true })}
                  onDelete={handleDeleteTelegram}
                  onLogout={handleLogoutTelegram}
                  totalCount={tgTotalCount}
                />
              </TabsContent>

              <TabsContent value="inactive" className="space-y-4">
                {tgError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="text-sm text-red-600">
                      <strong>Ошибка:</strong> {tgError}
                    </div>
                  </div>
                )}

                <ParserAccountsTable
                  accounts={tgAccounts}
                  platform="TELEGRAM"
                  loading={tgLoading}
                  hasMore={tgHasMore}
                  onLoadMore={() => loadMoreTgAccounts({ isAuthorized: false })}
                  onDelete={handleDeleteTelegram}
                  onLogout={handleLogoutTelegram}
                  onReauth={handleReauthTelegram}
                  totalCount={tgTotalCount}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* YouTube Tab */}
          <TabsContent value="YOUTUBE" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-muted-foreground flex-1 min-w-0">
                <p className="hidden sm:block">
                  Управление YouTube API сессиями для парсинга данных. 
                  Добавление и удаление сессий с YouTube API ключами.
                </p>
                <p className="sm:hidden">
                  Управление YouTube сессиями для парсинга данных.
                </p>
              </div>
              <div className="flex-shrink-0">
                <AddYouTubeAccountDialog
                  onAddAccount={handleAddYouTube}
                  disabled={isProcessing}
                />
              </div>
            </div>

            {ytError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-sm text-red-600">
                  <strong>Ошибка:</strong> {ytError}
                </div>
              </div>
            )}

            <ParserAccountsTable
              accounts={ytAccounts}
              platform="YOUTUBE"
              loading={ytLoading}
              hasMore={ytHasMore}
              onLoadMore={loadMoreYtAccounts}
              onDelete={handleDeleteYouTube}
              totalCount={ytTotalCount}
            />
          </TabsContent>

          {/* TikTok Tab */}
          <TabsContent value="TIKTOK">
            <PlatformNotAvailableMessage platform="TIKTOK" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParserAccountsManagement;
