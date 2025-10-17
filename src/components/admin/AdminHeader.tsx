import { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/ui-kit';
import { LogOut, User, Calendar } from 'lucide-react';

export const AdminHeader = () => {
  const { adminInfo, adminSignOut } = useAdminAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!adminInfo) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Админ панель</h1>
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">{adminInfo.username}</span>
          </Button>

          {showDropdown && (
            <>
              {/* Overlay для закрытия dropdown */}
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />

              {/* Dropdown меню */}
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{adminInfo.username}</p>
                      <p className="text-sm text-gray-500">{adminInfo.email}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Админ с {formatDate(adminInfo.createdAt)}</span>
                  </div>
                </div>

                <div className="p-2">
                  <Button
                    variant="ghost"
                    onClick={adminSignOut}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
