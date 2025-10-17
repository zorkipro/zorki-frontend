import { Link } from 'react-router-dom';
import { Button } from '@/ui-kit';
import { Star, LogOut, Database } from 'lucide-react';

interface DashboardHeaderProps {
  displayName: string;
  onSignOut: () => void;
}

export const DashboardHeader = ({ displayName, onSignOut }: DashboardHeaderProps) => {
  return (
    <div className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Zorki</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild className="hidden md:inline-flex">
              <Link to="/dev-tools">
                <Database className="w-4 h-4 mr-2" />
                Dev Tools
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">Добро пожаловать, {displayName}</span>
            <Button variant="outline" onClick={onSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
