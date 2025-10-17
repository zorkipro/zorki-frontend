import React from 'react';

interface LoadingScreenProps {
  text?: string;
}

/**
 * Переиспользуемый компонент экрана загрузки
 * Используется в ProtectedRoute и ProfileChecker
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  text = "Загрузка..." 
}) => (
  <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="w-5 h-5 text-white">⭐</div>
      </div>
      <p className="text-muted-foreground">{text}</p>
    </div>
  </div>
);
