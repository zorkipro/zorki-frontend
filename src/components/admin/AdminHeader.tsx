import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button, Sheet, SheetContent, SheetTrigger } from "@/ui-kit";
import { LogOut, User, Calendar, Settings, Database, Menu } from "lucide-react";

export const AdminHeader: React.FC = () => {
  const { adminInfo, adminSignOut } = useAdminAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!adminInfo) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <h1 
            className="text-lg sm:text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors" 
            onClick={() => navigate("/admin")}
          >
            Админ панель
          </h1>
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="outline" onClick={() => navigate("/admin/topic")} className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Управление топиками</span>
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin/parser")} className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Парсер</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Button 
              variant="ghost" 
              onClick={() => setShowDropdown(!showDropdown)} 
              className="hidden sm:flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">{adminInfo.username}</span>
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setShowDropdown(!showDropdown)} 
              className="sm:hidden text-gray-700 hover:text-gray-900 p-2"
            >
              <User className="w-5 h-5" />
            </Button>

            {showDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
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
                  <div className="p-4 border-b border-gray-100 flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Админ с {new Date(adminInfo.createdAt).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" })}</span>
                  </div>
                  <div className="p-2">
                    <Button variant="ghost" onClick={adminSignOut} className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                      <LogOut className="w-4 h-4 mr-2" />
                      Выйти
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden text-gray-700 hover:text-gray-900 p-2">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigate("/admin/topic");
                  }} 
                  className="w-full justify-start"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Управление топиками</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigate("/admin/parser");
                  }} 
                  className="w-full justify-start"
                >
                  <Database className="w-4 h-4 mr-2" />
                  <span>Парсер</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
