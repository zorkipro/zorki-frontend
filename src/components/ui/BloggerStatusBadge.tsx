import { Badge } from '@/ui-kit';
import type { BloggerVerificationStatus } from '@/api/types';
import { VERIFICATION_STATUS_CONFIG } from '@/config/statuses';

interface BloggerStatusBadgeProps {
  status: BloggerVerificationStatus;
}

export const BloggerStatusBadge = ({ status }: BloggerStatusBadgeProps) => {
  const config = VERIFICATION_STATUS_CONFIG[status];

  return <Badge variant={config.badge}>{config.label}</Badge>;
};
