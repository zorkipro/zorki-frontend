import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/ui-kit";
import { Star, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const HeaderComponent = () => {
  const { user, signOut, loading, bloggerInfo } = useAuth();

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  // Определяем ссылку для личного кабинета
  const getProfileLink = () => {
    // Если у пользователя есть связанный блогер
    if (bloggerInfo) {
      // Всегда ведем на редактирование профиля
      return "/profile/edit";
    }
    // Иначе ведем на настройку профиля
    return "/profile-setup";
  };

  return (
    <header className="bg-background border-b border-border-light sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Zorki</h1>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            {loading ? (
              <div className="w-8 h-8 animate-pulse bg-muted rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <Link to={getProfileLink()}>
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Личный кабинет
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Войти
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export const Header = memo(HeaderComponent);
