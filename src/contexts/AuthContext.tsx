/**
 * AuthContext - композиция SessionContext и BloggerContext
 * Обеспечивает обратную совместимость со старым API
 *
 * @deprecated Используйте useSession() и useBlogger() напрямую для новых компонентов
 */

import { ReactNode } from "react";
import { SessionProvider, useSession } from "./SessionContext";
import { BloggerProvider, useBlogger } from "./BloggerContext";
import type { User, Session } from "@supabase/supabase-js";
import type { ClientBloggerInfo, ClientLinkRequestInfo } from "@/api/types";

/**
 * Тип для обратной совместимости
 * Объединяет SessionContext и BloggerContext
 */
export interface AuthContextType {
  // Session fields
  user: User | null;
  session: Session | null;
  loading: boolean;
  accessToken: string | null;
  signOut: () => Promise<void>;

  // Blogger fields
  bloggerInfo: ClientBloggerInfo | null;
  lastLinkRequest: ClientLinkRequestInfo | null;
  bloggerInfoLoading: boolean;

  // Legacy field (для обратной совместимости)
  refreshBloggerInfo: () => Promise<void>;
}

/**
 * Hook для доступа к auth state (session + blogger)
 *
 * @deprecated Для новых компонентов используйте:
 * - useSession() для auth state
 * - useBlogger() для blogger data
 */
export const useAuth = (): AuthContextType => {
  const sessionContext = useSession();
  const bloggerContext = useBlogger();

  return {
    // Session data
    user: sessionContext.user,
    session: sessionContext.session,
    loading: sessionContext.loading,
    accessToken: sessionContext.accessToken,
    signOut: sessionContext.signOut,

    // Blogger data
    bloggerInfo: bloggerContext.bloggerInfo,
    lastLinkRequest: bloggerContext.lastLinkRequest,
    bloggerInfoLoading: bloggerContext.bloggerInfoLoading,

    // Legacy compatibility
    refreshBloggerInfo: bloggerContext.refreshBloggerInfo,
  };
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Композиция SessionProvider и BloggerProvider
 * Обеспечивает обратную совместимость со старым AuthProvider
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <SessionProvider>
      <BloggerProvider>{children}</BloggerProvider>
    </SessionProvider>
  );
};
