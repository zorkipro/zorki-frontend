import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@/ui-kit/components';

const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const AdminBloggerEditor = lazy(() => import('@/pages/AdminBloggerEditor'));

const PageLoader = () => <LoadingSpinner fullScreen text="Загрузка..." />;

/**
 * Подкомпонент для админских роутов
 * Использует useLocation для генерации уникальных key props
 */
export const AdminRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        index
        element={
          <Suspense fallback={<PageLoader />}>
            <AdminDashboard key={location.pathname} />
          </Suspense>
        }
      />
      <Route
        path="blogger/:username/edit"
        element={
          <Suspense fallback={<PageLoader />}>
            <AdminBloggerEditor key={location.pathname} />
          </Suspense>
        }
      />
    </Routes>
  );
};

