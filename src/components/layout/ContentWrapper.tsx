import { ReactNode } from "react";

interface ContentWrapperProps {
  children: ReactNode;
  className?: string;
  allowShadow?: boolean;
  overflowHidden?: boolean;
}

/**
 * Обертка для контентных блоков с общими стилями
 * Убирает дублирование классов и упрощает поддержку
 */
export const ContentWrapper = ({ 
  children, 
  className = "", 
  allowShadow = false,
  overflowHidden = true
}: ContentWrapperProps) => {
  const baseClasses = "w-full max-w-full";
  const shadowClasses = allowShadow ? "pb-3" : "";
  const overflowClasses = overflowHidden ? "overflow-x-hidden" : "";
  
  return (
    <div className={`${baseClasses} ${shadowClasses} ${overflowClasses} ${className}`.trim()}>
      {children}
    </div>
  );
};

