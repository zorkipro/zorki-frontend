import { memo, useMemo } from "react";
import { Users } from "lucide-react";

interface FollowersDisplayProps {
  count: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const FollowersDisplayComponent = ({
  count,
  showIcon = true,
  size = "md",
  className = "",
}: FollowersDisplayProps) => {
  const formattedCount = useMemo(() => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString();
  }, [count]);

  return (
    <div
      className={`flex items-center space-x-1 ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Users className={iconSizes[size]} />}
      <span className="font-medium">{formattedCount}</span>
    </div>
  );
};

export const FollowersDisplay = memo(FollowersDisplayComponent);
