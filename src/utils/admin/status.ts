/**
 * Получить цвет статуса блогера
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "APPROVED":
      return "bg-green-500";
    case "MODERATION":
      return "bg-yellow-500";
    case "REJECTED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

/**
 * Получить текстовое описание статуса блогера
 */
export const getStatusText = (status: string): string => {
  switch (status) {
    case "APPROVED":
      return "Одобрен";
    case "MODERATION":
      return "На проверке";
    case "REJECTED":
      return "Отклонён";
    default:
      return "Новый";
  }
};
