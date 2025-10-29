import React from "react";

interface LoadingScreenProps {
  text?: string;
}

/**
 * Переиспользуемый компонент экрана загрузки
 * Используется в ProtectedRoute и ProfileChecker
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  text = "Загрузка...",
}) => (
  <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
    <div className="text-center">
      <img 
        src="/logo.svg" 
        alt="Zorki" 
        className="w-8 h-8 mx-auto mb-4"
      />
      <p className="text-muted-foreground">{text}</p>
    </div>
  </div>
);
