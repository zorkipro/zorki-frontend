import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui-kit";
import { Users, CheckCircle, Clock, Eye } from "lucide-react";
import type { AdminGetBloggersStatsOutputDto } from "@/api/types";

interface StatsCardsProps {
  stats: AdminGetBloggersStatsOutputDto;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
      <Card className="p-3 lg:p-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
          <CardTitle className="text-xs lg:text-sm font-medium">
            Всего блогеров
          </CardTitle>
          <Users className="h-3 w-3 lg:h-4 lg:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <div className="text-lg lg:text-2xl font-bold">
            {stats.totalBloggersCount}
          </div>
        </CardContent>
      </Card>

      <Card className="p-3 lg:p-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
          <CardTitle className="text-xs lg:text-sm font-medium">
            Одобрено
          </CardTitle>
          <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-green-500" />
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <div className="text-lg lg:text-2xl font-bold text-green-600">
            {stats.totalApprovedBloggersCount}
          </div>
        </CardContent>
      </Card>

      <Card className="p-3 lg:p-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
          <CardTitle className="text-xs lg:text-sm font-medium">
            Запросы
          </CardTitle>
          <Clock className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-500" />
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <div className="text-lg lg:text-2xl font-bold text-yellow-600">
            {stats.totalModerationLinkRequestsCount}
          </div>
        </CardContent>
      </Card>

      <Card className="p-3 lg:p-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
          <CardTitle className="text-xs lg:text-sm font-medium">
            Видимых
          </CardTitle>
          <Eye className="h-3 w-3 lg:h-4 lg:w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <div className="text-lg lg:text-2xl font-bold text-blue-600">
            {stats.totalVisibleBloggersCount}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
