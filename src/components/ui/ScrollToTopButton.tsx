import React, { useState, useEffect } from 'react';
import { Button } from '@/ui-kit';
import { ChevronUp } from 'lucide-react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Показываем кнопку когда пользователь прокрутил больше 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      size="sm"
      className="fixed bottom-6 right-6 z-50 bg-black/20 hover:bg-black/30 text-white border-0 backdrop-blur-sm transition-all duration-200 hover:scale-105"
      aria-label="Прокрутить наверх"
    >
      <ChevronUp className="w-4 h-4" />
    </Button>
  );
};
