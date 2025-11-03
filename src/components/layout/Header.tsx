import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Sheet, SheetContent, SheetTrigger } from "@/ui-kit";
import { LogOut, User, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const HeaderComponent = () => {
  const { user, signOut, loading, bloggerInfo, lastLinkRequest } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileLink = (bloggerInfo || lastLinkRequest?.username) ? "/profile/edit" : "/profile-setup";
  const handleSignOut = () => {
    signOut();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-background border-b border-border-light sticky top-0 z-50">
        <div className="w-full pl-4 pr-4">
          <div className="flex items-center justify-between h-16 lg:pl-6">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/logo.svg" 
                alt="Zorki" 
                className="w-8 h-8"
              />
              <h1 className="text-xl font-bold text-foreground">Zorki</h1>
            </Link>

            {/* Desktop buttons - скрыты на мобильных */}
            <div className="hidden min-[430px]:flex items-center space-x-2">
              {loading ? (
                <div className="w-8 h-8 animate-pulse bg-muted rounded" />
              ) : user ? (
                <>
                  <Link to={profileLink}>
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Личный кабинет
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm">Войти</Button>
                </Link>
              )}
            </div>

            {/* Mobile buttons - только на мобильных */}
            <div className="min-[430px]:hidden">
              {user ? (
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col gap-4 mt-8">
                      <Link to={profileLink} onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full justify-start">
                          <User className="w-4 h-4 mr-2" />
                          Личный кабинет
                        </Button>
                      </Link>
                      <Button variant="outline" onClick={handleSignOut} className="w-full justify-start">
                        <LogOut className="w-4 h-4 mr-2" />
                        Выйти
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm">Войти</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {user && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border-light z-40 min-[430px]:hidden">
          <div className="flex items-center justify-around h-16 px-4">
            <Link to={profileLink} className="flex-1 flex items-center justify-center">
              <Button variant="ghost" className="w-full flex-col h-auto py-2">
                <User className="w-5 h-5 mb-1" />
                <span className="text-xs">Кабинет</span>
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleSignOut} className="flex-1 flex-col h-auto py-2">
              <LogOut className="w-5 h-5 mb-1" />
              <span className="text-xs">Выйти</span>
            </Button>
          </div>
        </nav>
      )}
    </>
  );
};

export const Header = memo(HeaderComponent);
