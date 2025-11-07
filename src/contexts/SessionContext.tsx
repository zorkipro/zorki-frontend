/**
 * SessionContext - управление аутентификацией и сессией пользователя
 * Отвечает только за auth state (SRP - Single Responsibility Principle)
 */

import {createContext, useContext, useEffect, useState, useCallback, ReactNode,} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";
import { saveAccessToken, removeAccessToken } from "@/utils/googleAuth";
import {clientMeQueryKey} from "@/hooks/profile/useClientMeQuery.ts";
import {useQueryClient} from "@tanstack/react-query";
import {ClientAuthMeOutputDto} from "@/api/types.ts";

export interface SessionContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  accessToken: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  determineRedirectPath: () => Promise<string>;
  isSessionReady:boolean
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const isSessionReady = !!user && !!accessToken && !loading;

  const queryClient = useQueryClient();

  const determineRedirectPath = useCallback(async (): Promise<string> => {
    const cachedData:ClientAuthMeOutputDto = queryClient.getQueryData(clientMeQueryKey);

    if (cachedData) {
      const username =
          cachedData.blogger?.username || cachedData.lastLinkRequest?.username;
      return username ? "/profile/edit" : "/profile-setup";
    }

  }, [queryClient]);

  const updateSession = useCallback((newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user ?? null);

    const token = newSession?.access_token ?? null;
    setAccessToken(token);

    if (token) {
      saveAccessToken(token);
    } else {
      removeAccessToken();
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      updateSession(data.session);
    } catch (error) {
      logger.error("Failed to refresh session", error);
    }
  }, [updateSession]);

  const signOut = useCallback(async () => {
    try {
      removeAccessToken();
      setAccessToken(null);

      await supabase.auth.signOut();

      setUser(null);
      setSession(null);
    } catch (error) {
      logger.error("Sign out failed", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      updateSession(newSession);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      updateSession(initialSession);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [updateSession]);

  const value: SessionContextType = {
    user,
    session,
    loading,
    accessToken,
    signOut,
    refreshSession,
    determineRedirectPath,
    isSessionReady
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
