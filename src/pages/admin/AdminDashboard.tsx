import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminBloggers } from "@/hooks/admin/useAdminBloggers";
import { useAdminBloggerActions } from "@/hooks/admin/useAdminBloggerActions";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/ui-kit";
import { Input } from "@/ui-kit";
import { Checkbox } from "@/ui-kit";
import { Star, LogOut, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/ui-kit/components";
import { StatsCards } from "@/components/admin/StatsCards";
import { AdminLinkRequestsTable } from "@/components/admin/AdminLinkRequestsTable";
import { BloggersTable } from "@/components/admin/BloggersTable";
import { GenderSelectionTable } from "@/components/admin/GenderSelectionTable";
import { AddBloggerDialog } from "@/components/admin/AddBloggerDialog";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TopicsManagementDialog } from "@/components/admin/TopicsManagementDialog";
import { formatNumber } from "@/utils/formatters";
import { logError } from "@/utils/logger";
import { adminToggleBloggerVisibility } from "@/api/endpoints/admin";
import { mapLinkRequestToTableFormat } from "@/utils/admin/mappers";
import type { AdminGetLinkBloggerClientRequestOutputDto } from "@/api/types";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { adminInfo, loading: adminLoading } = useAdminAuth();

  const [activeTab, setActiveTab] = useState("bloggers"); // По умолчанию показываем блогеров
  const [topicsDialogOpen, setTopicsDialogOpen] = useState(false);

  const {
    allBloggers,
    bloggersWithoutGender,
    linkRequests,
    loading,
    searchLoading,
    isLoadingMore,
    hasMoreBloggers,
    totalBloggersCount,
    stats,
    searchTerm,
    setSearchTerm,
    showHidden,
    setShowHidden,
    fetchBloggers,
    loadMoreBloggers,
    approveRequest,
    rejectRequest,
    updateBloggerVisibility,
    updateBloggerGenderLocally,
    fetchBloggersWithoutGender,
    loadMoreGenderBloggers,
    loadingGenderBloggers,
    hasMoreGenderBloggers,
    totalGenderBloggersCount,
    clearGenderCache,
    isProcessing,
    error,
  } = useAdminBloggers();

  // Добавляем логику для работы с блогерами
  const { addBlogger } = useAdminBloggerActions(() => {
    // Обновляем список блогеров после добавления
    fetchBloggers(1);
  });

  // Загружаем первую пачку блогеров без пола при переходе на вкладку "Выбор пола"
  useEffect(() => {
    if (activeTab === "gender-selection" && bloggersWithoutGender.length === 0 && !loadingGenderBloggers) {
      fetchBloggersWithoutGender(1, false);
    }
  }, [activeTab, bloggersWithoutGender.length, loadingGenderBloggers, fetchBloggersWithoutGender]);

  // Поиск теперь обрабатывается на сервере через API
  const filteredBloggers = allBloggers;

  // Filter link requests
  const filteredLinkRequests = useMemo(() => {
    let result = linkRequests.map(mapLinkRequestToTableFormat);

    // Filter by search term
    if (searchTerm) {
      result = result.filter((request) => {
        const bloggerName = `${request.name} ${request.lastName}`.trim() || "";
        const username = request.username || "";
        const userEmail = request.user_email || "";

        return (
          bloggerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          userEmail.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    return result;
  }, [linkRequests, searchTerm]);

  const handleToggleVisibility = async (
    bloggerId: number,
    currentVisibility: boolean,
  ) => {
    try {
      // ✅ Реализован API вызов для изменения видимости блогера
      await adminToggleBloggerVisibility(bloggerId);

      // Обновляем локальное состояние мгновенно
      updateBloggerVisibility(bloggerId, !currentVisibility);

      toast({
        title: "Успех",
        description: `Блогер ${bloggerId} ${currentVisibility ? "показан" : "скрыт"}`,
        variant: "default",
      });
    } catch (error) {
      logError("Error toggling visibility:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить видимость блогера",
        variant: "destructive",
      });
    }
  };

  const handleAddBlogger = async (instagramUsername: string) => {
    try {
      // Используем хук для создания блогера
      await addBlogger(instagramUsername);
    } catch (error) {
      logError("Error creating blogger:", error);
      throw error; // Пробрасываем ошибку для обработки в AddBloggerDialog
    }
  };

  if (loading || adminLoading) {
    return <LoadingSpinner fullScreen text="Загрузка..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Admin Header */}
      <AdminHeader onOpenTopicsManagement={() => setTopicsDialogOpen(true)} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <StatsCards stats={stats} />

        {/* Controls */}
        <div className="space-y-4 mb-6">
          {/* Search and Filters */}
          <div className="flex gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени или username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Show Hidden Checkbox */}
            {activeTab === "bloggers" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-hidden"
                  checked={showHidden}
                  onCheckedChange={(checked) => setShowHidden(!!checked)}
                />
                <label
                  htmlFor="show-hidden"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Показывать скрытых
                </label>
              </div>
            )}
          </div>

          {/* Tabs and Add Blogger Button */}
          <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={activeTab === "bloggers" ? "default" : "outline"}
                onClick={() => setActiveTab("bloggers")}
                size="sm"
              >
                Все блогеры
              </Button>
              <Button
                variant={activeTab === "gender-selection" ? "default" : "outline"}
                onClick={() => setActiveTab("gender-selection")}
                size="sm"
              >
                Выбор пола
              </Button>
              <Button
                variant={activeTab === "link-requests" ? "default" : "outline"}
                onClick={() => setActiveTab("link-requests")}
                size="sm"
              >
                Запросы
              </Button>
            </div>

            {/* Add Blogger Button - только на вкладке блогеров */}
            {activeTab === "bloggers" && (
              <AddBloggerDialog onAddBlogger={handleAddBlogger} />
            )}
          </div>

          {/* Info */}
          <div className="text-sm text-muted-foreground">
            {activeTab === "link-requests"
              ? "Показаны запросы на связывание блогеров с клиентами. При одобрении запроса блогер автоматически становится верифицированным."
              : activeTab === "gender-selection"
              ? "Быстрый выбор пола для блогеров без указанного пола. Нажмите на кнопку с нужным полом для обновления."
              : ""}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "bloggers" ? (
          <BloggersTable
            bloggers={filteredBloggers}
            onToggleVisibility={handleToggleVisibility}
            formatNumber={formatNumber}
            searchLoading={searchLoading}
            isLoadingMore={isLoadingMore}
            hasMore={hasMoreBloggers}
            onLoadMore={loadMoreBloggers}
            totalCount={
              searchTerm ? filteredBloggers.length : totalBloggersCount
            }
          />
       ) : activeTab === "gender-selection" ? (
         <GenderSelectionTable
           bloggers={bloggersWithoutGender}
           onBloggerGenderUpdated={updateBloggerGenderLocally}
           loading={loadingGenderBloggers}
           hasMore={hasMoreGenderBloggers}
           onLoadMore={loadMoreGenderBloggers}
           totalCount={totalGenderBloggersCount}
           onClearCache={clearGenderCache}
         />
       ) : (
          <AdminLinkRequestsTable
            requests={filteredLinkRequests}
            loading={loading}
            isProcessing={isProcessing}
            onApprove={approveRequest}
            onReject={rejectRequest}
          />
        )}
      </div>

      {/* Topics Management Dialog */}
      <TopicsManagementDialog
        open={topicsDialogOpen}
        onOpenChange={setTopicsDialogOpen}
      />
    </div>
  );
};

export default AdminDashboard;