import { useState, useEffect } from "react";
import { useAdminBloggers } from "@/hooks/admin/useAdminBloggers";
import { useAdminBloggerActions } from "@/hooks/admin/useAdminBloggerActions";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/ui-kit";
import { Input } from "@/ui-kit";
import { Checkbox } from "@/ui-kit";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/ui-kit/components";
import { StatsCards } from "@/components/admin/StatsCards";
import { AdminLinkRequestsTable } from "@/components/admin/AdminLinkRequestsTable";
import { BloggersTable } from "@/components/admin/BloggersTable";
import { GenderSelectionTable } from "@/components/admin/GenderSelectionTable";
import { AddBloggerDialog } from "@/components/admin/AddBloggerDialog";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { formatNumber } from "@/utils/formatters";
import { adminToggleBloggerVisibility } from "@/api/endpoints/admin";

const TAB_CONFIG = {
  bloggers: { label: "Все блогеры", desc: "" },
  "gender-selection": { label: "Выбор пола", desc: "Быстрый выбор пола для блогеров без указанного пола. Нажмите на кнопку с нужным полом для обновления." },
  "link-requests": { label: "Запросы", desc: "Показаны запросы на связывание блогеров с клиентами. При одобрении запроса блогер автоматически становится верифицированным." },
} as const;

const AdminDashboard = () => {
  const { toast } = useToast();
  const { loading: adminLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<keyof typeof TAB_CONFIG>("bloggers");

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
  } = useAdminBloggers();

  const { addBlogger } = useAdminBloggerActions(() => fetchBloggers(1));

  useEffect(() => {
    if (activeTab === "gender-selection" && !bloggersWithoutGender.length && !loadingGenderBloggers) {
      fetchBloggersWithoutGender(1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, bloggersWithoutGender.length, loadingGenderBloggers]);

  const handleToggleVisibility = async (bloggerId: number, currentVisibility: boolean) => {
    try {
      await adminToggleBloggerVisibility(bloggerId);
      updateBloggerVisibility(bloggerId, !currentVisibility);
      toast({
        title: "Успех",
        description: `Блогер ${bloggerId} ${currentVisibility ? "показан" : "скрыт"}`,
      });
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось изменить видимость блогера",
        variant: "destructive",
      });
    }
  };

  if (loading || adminLoading) {
    return <LoadingSpinner fullScreen text="Загрузка..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <AdminHeader />

      <div className="container mx-auto px-4 py-6">
        <StatsCards stats={stats} />

        <div className="space-y-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени или username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === "bloggers" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-hidden"
                  checked={showHidden}
                  onCheckedChange={(checked) => setShowHidden(!!checked)}
                />
                <label htmlFor="show-hidden" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Показывать скрытых
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-2">
              {Object.keys(TAB_CONFIG).map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  onClick={() => setActiveTab(tab as keyof typeof TAB_CONFIG)}
                  size="sm"
                >
                  {TAB_CONFIG[tab as keyof typeof TAB_CONFIG].label}
                </Button>
              ))}
            </div>
            {activeTab === "bloggers" && <AddBloggerDialog onAddBlogger={addBlogger} />}
          </div>

          {TAB_CONFIG[activeTab].desc && (
            <div className="text-sm text-muted-foreground">{TAB_CONFIG[activeTab].desc}</div>
          )}
        </div>

        {activeTab === "bloggers" && (
          <BloggersTable
            bloggers={allBloggers}
            onToggleVisibility={handleToggleVisibility}
            formatNumber={formatNumber}
            searchLoading={searchLoading}
            isLoadingMore={isLoadingMore}
            hasMore={hasMoreBloggers}
            onLoadMore={loadMoreBloggers}
            totalCount={searchTerm ? allBloggers.length : totalBloggersCount}
          />
        )}
        {activeTab === "gender-selection" && (
          <GenderSelectionTable
            bloggers={bloggersWithoutGender}
            onBloggerGenderUpdated={updateBloggerGenderLocally}
            loading={loadingGenderBloggers}
            hasMore={hasMoreGenderBloggers}
            onLoadMore={loadMoreGenderBloggers}
            totalCount={totalGenderBloggersCount}
            onClearCache={clearGenderCache}
          />
        )}
        {activeTab === "link-requests" && (
          <AdminLinkRequestsTable
            requests={linkRequests}
            loading={loading}
            isProcessing={isProcessing}
            onApprove={approveRequest}
            onReject={rejectRequest}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;