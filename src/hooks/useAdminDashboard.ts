import { useAdminBloggers } from './admin/useAdminBloggers';
import { useAdminBloggerActions } from './admin/useAdminBloggerActions';
import { useAdminDraftPublisher } from './admin/useAdminDraftPublisher';

/**
 * Главный хук для админ-панели
 * Объединяет функциональность загрузки блогеров, CRUD операций и публикации черновиков
 */
export const useAdminDashboard = () => {
  // Загрузка списка блогеров и статистики
  const { allBloggers, loading, stats, fetchBloggers } = useAdminBloggers();

  // CRUD операции для блогеров
  const { addBlogger, updateBlogger, toggleVisibility } = useAdminBloggerActions(fetchBloggers);

  // Публикация черновиков и апрув/реджект блогеров
  const { approveBlogger, rejectBlogger } = useAdminDraftPublisher(fetchBloggers);

  return {
    allBloggers,
    loading,
    stats,
    fetchBloggers,
    addBlogger,
    updateBlogger,
    toggleVisibility,
    approveBlogger,
    rejectBlogger,
  };
};
