// DEPRECATED: Legacy profile types - DO NOT USE IN NEW CODE
// All types have been migrated to new API types
export type {
  Influencer,
  InfluencerInsert,
  InfluencerUpdate,
  InfluencerProfile,
  InfluencerProfileInsert,
  InfluencerProfileUpdate,
  PlatformStats,
  PlatformStatsInsert,
  PlatformStatsUpdate,
  Platform,
  Topic,
  BannedTopic,
  ProfileEdit,
  ProfileEditInsert,
  ProfileEditUpdate,
  Screenshot,
  EditData,
  PlatformData,
  ProfileFormErrors,
  PlatformType,
  VerificationStatus,
  VisibilityStatus,
  EditStatus,
  WorkFormat,
  GenderType,
  ProfileEditorState,
  UseProfileEditorReturn,
  UseScreenshotManagerReturn,
} from './profile';

// Export new API types
export type { Blogger, FilterState } from './blogger';

export type {
  BloggerListResponseDto,
  BloggerDetailResponseDto,
  BloggerUpdateProfileInputDto,
  BloggerUpdateSocialPriceInputDto,
  SocialAccountResponseDto,
  TopicResponseDto,
  ScreenshotResponseDto,
  BloggerUpdateProfileDraft,
  BloggerSocialPriceDraft,
  BloggerCoverageSocialDraft,
  AdminLoginInputDto,
  AdminLoginResponseDto,
  ClientLinkToBloggerInputDto,
  PlatformType,
  VerificationStatus,
  VisibilityStatus,
  CoverageSocialType,
} from '@/api/types';

// Export utility functions
export {
  formatNumber,
  getAvatarUrl,
  formatCurrency,
  parseNumericValue,
  calculateEngagementRate,
  formatPlatformMetrics,
  isValidEmail,
  isValidUrl,
  generateId,
} from '@/utils/formatters';
