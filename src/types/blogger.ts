// Re-export types from profile for compatibility
export type { PlatformData } from './profile';

// Legacy Blogger interface for backward compatibility
// This should be gradually replaced with Influencer type
export interface Blogger {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  promoText: string;
  platforms: {
    instagram?: PlatformData;
    tiktok?: PlatformData;
    youtube?: PlatformData;
    telegram?: PlatformData;
  };
  // Legacy fields for compatibility
  followers: number;
  postPrice: number;
  storyPrice: number;
  postReach: number;
  storyReach: number;
  engagementRate: number;
  gender?: 'мужчина' | 'женщина' | 'пара' | 'паблик';
  category: string;
  topics: string[];
  allowsBarter: boolean;
  inMartRegistry: boolean;
  legalForm?: 'ИП' | 'профдоход' | 'договор подряда' | 'ООО';
  restrictedTopics: string[];
  cooperationConditions: string;
  workFormat?: string;
  paymentTerms: string;
  contact_url?: string;
  verificationStatus?: 'NEW' | 'APPROVED' | 'REJECTED' | 'MODERATION';
}

export interface FilterState {
  search: string;
  gender: string;
  category: string;
  followersMin: string;
  followersMax: string;
  postPriceMin: string;
  postPriceMax: string;
  storyPriceMin: string;
  storyPriceMax: string;
  allowsBarter: boolean;
  inMartRegistry: boolean;
  restrictedTopics: string;
}
