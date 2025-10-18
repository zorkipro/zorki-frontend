import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PageSkeletonComponent = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header Skeleton */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />

          <div className="grid gap-6">
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PageSkeleton = memo(PageSkeletonComponent);
