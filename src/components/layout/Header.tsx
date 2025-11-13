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
      <header className="bg-background border-b border-border-light sticky top-0 z-[100] w-full max-w-full">
        <div className="w-full max-w-full px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 max-w-full">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 min-w-0">
              <img 
                src="/logo.svg" 
                alt="Zorki" 
                className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0"
              />
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">Zorki</h1>
            </Link>

            {/* Desktop buttons - скрыты на мобильных */}
            <div className="hidden min-[430px]:flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
              {loading ? (
                <div className="w-8 h-8 animate-pulse bg-muted rounded flex-shrink-0" />
              ) : user ? (
                <>
                  <Link to={profileLink} className="flex-shrink-0">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      <span className="hidden sm:inline">Личный кабинет</span>
                      <span className="sm:hidden">Кабинет</span>
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs sm:text-sm flex-shrink-0">
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    <span className="hidden sm:inline">Выйти</span>
                  </Button>
                </>
              ) : (
                <Link to="/login" className="flex-shrink-0">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">Войти</Button>
                </Link>
              )}
            </div>

            {/* Mobile buttons - только на мобильных */}
            <div className="min-[430px]:hidden flex-shrink-0">
              {user ? (
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[280px] sm:w-80 max-w-[90vw]">
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
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border-light z-40 min-[430px]:hidden w-full max-w-full">
          <div className="flex items-center justify-around h-14 sm:h-16 px-2 sm:px-4 max-w-full">
            <Link to={profileLink} className="flex-1 flex items-center justify-center min-w-0">
              <Button variant="ghost" className="w-full flex-col h-auto py-2 text-xs">
                <User className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs truncate">Кабинет</span>
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleSignOut} className="flex-1 flex-col h-auto py-2 text-xs min-w-0">
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs truncate">Выйти</span>
            </Button>
          </div>
        </nav>
      )}
    </>
  );
};

export const Header = memo(HeaderComponent);
