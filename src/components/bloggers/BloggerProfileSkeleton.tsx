import { Card, CardContent, CardHeader } from "@/ui-kit";
import { Skeleton } from "@/ui-kit";

export const BloggerProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-gradient-subtle border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and basic info */}
            <div className="flex flex-col md:flex-row gap-4">
              <Skeleton className="w-24 h-24 rounded-full mx-auto md:mx-0" />
              <div className="text-center md:text-left">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <div className="flex gap-2 justify-center md:justify-start">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-6 w-16 mx-auto mb-1" />
                  <Skeleton className="h-4 w-12 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Platforms */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-24 mb-2" />
                        <div className="grid grid-cols-2 gap-4">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Topics Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-20" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Banned Topics Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-20" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
