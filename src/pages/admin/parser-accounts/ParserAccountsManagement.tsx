import React, { useState, useEffect } from "react";
import { Button } from "@/ui-kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui-kit";
import { LoadingSpinner } from "@/ui-kit/components";
import { AdminHeader } from "@/components/admin/AdminHeader.tsx";
import { useParserAccounts } from "@/hooks/admin/useParserAccounts.ts";
import { ParserAccountsTable } from "@/components/admin/parser/ParserAccountsTable.tsx";
import { AddInstagramAccountDialog } from "@/components/admin/parser/AddInstagramAccountDialog.tsx";
import { AddTelegramAccountDialog } from "@/components/admin/parser/AddTelegramAccountDialog.tsx";
import { PlatformNotAvailableMessage } from "@/components/admin/parser/PlatformNotAvailableMessage.tsx";
import type { ParserPlatform } from "@/api/types.ts";

const ParserAccountsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ParserPlatform>("INSTAGRAM");
  
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
    
    // Telegram
    addTgAccount,
    confirmTgAccount,
    
    // General
    isProcessing,
  } = useParserAccounts();

  // Load Instagram accounts on mount
  useEffect(() => {
    if (activeTab === "INSTAGRAM") {
      fetchIgAccounts();
    }
  }, [activeTab, fetchIgAccounts]);

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

  if (igLoading && igAccounts.length === 0) {
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
              onLoadMore={loadMoreIgAccounts}
              onDelete={handleDeleteInstagram}
              onLogout={handleLogoutInstagram}
              totalCount={igTotalCount}
            />
          </TabsContent>

          {/* Telegram Tab */}
          <TabsContent value="TELEGRAM" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-muted-foreground flex-1 min-w-0">
                <p className="hidden sm:block">
                  Управление Telegram аккаунтами для парсинга данных. 
                  Добавление аккаунтов работает, но просмотр списка сессий пока недоступен.
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

            {/* Telegram limitation notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="text-sm text-yellow-800">
                <strong>Ограничение:</strong> Просмотр списка Telegram сессий недоступен. 
                Обратитесь к backend разработчику для добавления эндпоинта <code>GET /tg-client</code>.
              </div>
            </div>

            {/* Empty state for Telegram */}
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✈️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Telegram аккаунты
              </h3>
              <p className="text-gray-600 mb-4">
                Добавление аккаунтов работает, но просмотр списка пока недоступен
              </p>
              <div className="text-sm text-gray-500">
                Используйте кнопку "Добавить Telegram" для добавления новых аккаунтов
              </div>
            </div>
          </TabsContent>

          {/* YouTube Tab */}
          <TabsContent value="YOUTUBE">
            <PlatformNotAvailableMessage platform="YOUTUBE" />
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
