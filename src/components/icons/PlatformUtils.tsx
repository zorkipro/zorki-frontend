import React from "react";
import {
  InstagramIcon,
  TikTokIcon,
  TelegramIcon,
  YouTubeIcon,
} from "./PlatformIcons";

export const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "instagram":
      return <InstagramIcon className="w-5 h-5" />;
    case "youtube":
      return <YouTubeIcon className="w-5 h-5" />;
    case "tiktok":
      return <TikTokIcon className="w-5 h-5" />;
    case "telegram":
      return <TelegramIcon className="w-5 h-5" />;
    default:
      return null;
  }
};

export const getPlatformName = (platform: string) => {
  switch (platform) {
    case "instagram":
      return "Instagram";
    case "youtube":
      return "YouTube";
    case "tiktok":
      return "TikTok";
    case "telegram":
      return "Telegram";
    default:
      return platform;
  }
};
