import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminMe } from '@/api/endpoints/admin';
import { APIError } from '@/api/client';
import { logError } from '@/utils/logger';
import type { AdminAuthMeOutputDto } from '@/api/types';

interface AdminAuthContextType {
  adminInfo: AdminAuthMeOutputDto | null;
  loading: boolean;
  adminSignOut: () => void;
  fetchAdminInfo: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  adminInfo: null,
  loading: true,
  adminSignOut: () => {},
  fetchAdminInfo: async () => {},
});

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState<AdminAuthMeOutputDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Функция для получения информации об админе
  const fetchAdminInfo = async () => {
    const adminToken = sessionStorage.getItem('adminToken');

    if (!adminToken) {
      setAdminInfo(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getAdminMe();
      setAdminInfo(data);
    } catch (error) {
      logError('Failed to fetch admin info:', error);

      // Если токен невалидный или истек - очищаем и перенаправляем на логин
      if (error instanceof APIError && error.statusCode === 401) {
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminTempToken');
        navigate('/admin/login');
        return;
      }

      setAdminInfo(null);
    } finally {
      setLoading(false);
    }
  };

  // Функция выхода из админки
  const adminSignOut = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminTempToken');
    setAdminInfo(null);
    navigate('/admin/login');
  };

  useEffect(() => {
    // Проверяем наличие токена при монтировании
    const adminToken = sessionStorage.getItem('adminToken');

    if (adminToken) {
      fetchAdminInfo();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        adminInfo,
        loading,
        adminSignOut,
        fetchAdminInfo,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
