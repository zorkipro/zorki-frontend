import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { logError } from "@/utils/logger";
import {
  getIgSessions,
  loginIgAccount,
  deleteIgSession,
  logoutIgSession,
  loginTgAccount,
  confirmTgLogin,
} from "@/api/endpoints/admin";
import type {
  ParserPlatform,
  ParserAccount,
  IgClientSessionsOutputDto,
  GetIgSessionsParams,
} from "@/api/types";

interface UseParserAccountsReturn {
  // Instagram accounts
  igAccounts: ParserAccount[];
  igLoading: boolean;
  igError: string | null;
  igHasMore: boolean;
  igTotalCount: number;
  fetchIgAccounts: (params?: GetIgSessionsParams) => Promise<void>;
  loadMoreIgAccounts: () => Promise<void>;
  addIgAccount: (username: string, password: string) => Promise<void>;
  deleteIgAccount: (sessionId: number) => Promise<void>;
  logoutIgAccount: (sessionId: number) => Promise<void>;
  
  // Telegram accounts (limited functionality)
  addTgAccount: (phone: string, apiHash: string, apiId: number) => Promise<void>;
  confirmTgAccount: (phone: string, code: string) => Promise<void>;
  
  // General
  isProcessing: boolean;
}

export const useParserAccounts = (): UseParserAccountsReturn => {
  const { toast } = useToast();
  
  // Instagram state
  const [igAccounts, setIgAccounts] = useState<ParserAccount[]>([]);
  const [igLoading, setIgLoading] = useState(false);
  const [igError, setIgError] = useState<string | null>(null);
  const [igHasMore, setIgHasMore] = useState(true);
  const [igTotalCount, setIgTotalCount] = useState(0);
  const [igCurrentPage, setIgCurrentPage] = useState(1);
  
  // General state
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper function to convert IG session to ParserAccount
  const convertIgSessionToAccount = (session: IgClientSessionsOutputDto): ParserAccount => ({
    id: session.id,
    platform: 'INSTAGRAM',
    identifier: session.username,
    isAuthorized: session.isAuthorized,
    createdAt: session.createdAt,
    requests: session.requests,
    lastReset: session.lastReset,
  });

  // Fetch Instagram accounts
  const fetchIgAccounts = useCallback(async (params: GetIgSessionsParams = {}) => {
    try {
      setIgLoading(true);
      setIgError(null);
      
      const response = await getIgSessions({
        page: 1,
        size: 50,
        ...params,
      });
      
      // Debug logging
      console.log("Instagram API Response:", response);
      console.log("Instagram sessions:", response.items);
      
      // Детальное логирование каждого аккаунта
      response.items.forEach((session, index) => {
        console.log(`Session ${index}:`, {
          id: session.id,
          username: session.username,
          isAuthorized: session.isAuthorized,
          requests: session.requests,
          requestsType: typeof session.requests,
          lastReset: session.lastReset,
          createdAt: session.createdAt
        });
      });
      
      const accounts = response.items.map(convertIgSessionToAccount);
      
      console.log("Converted accounts:", accounts);
      
      setIgAccounts(accounts);
      setIgTotalCount(response.totalCount);
      setIgHasMore(response.page < response.pagesCount);
      setIgCurrentPage(1);
      
    } catch (error) {
      logError("Error fetching IG accounts:", error);
      setIgError("Не удалось загрузить аккаунты Instagram");
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить аккаунты Instagram",
        variant: "destructive",
      });
    } finally {
      setIgLoading(false);
    }
  }, [toast]);

  // Load more Instagram accounts
  const loadMoreIgAccounts = useCallback(async () => {
    if (igLoading || !igHasMore) return;
    
    try {
      setIgLoading(true);
      
      const response = await getIgSessions({
        page: igCurrentPage + 1,
        size: 50,
      });
      
      const newAccounts = response.items.map(convertIgSessionToAccount);
      
      setIgAccounts(prev => [...prev, ...newAccounts]);
      setIgHasMore(response.page < response.pagesCount);
      setIgCurrentPage(prev => prev + 1);
      
    } catch (error) {
      logError("Error loading more IG accounts:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить дополнительные аккаунты",
        variant: "destructive",
      });
    } finally {
      setIgLoading(false);
    }
  }, [igLoading, igHasMore, igCurrentPage, toast]);

  // Add Instagram account
  const addIgAccount = useCallback(async (username: string, password: string) => {
    try {
      setIsProcessing(true);
      
      const result = await loginIgAccount(username, password);
      
      if (result.isAuthorized && result.isVerify) {
        toast({
          title: "Успех",
          description: `Instagram аккаунт @${username} успешно добавлен`,
          variant: "default",
        });
        
        // Add optimistic update - add the account to the list immediately
        const newAccount: ParserAccount = {
          id: Date.now(), // Temporary ID until we get real data
          platform: 'INSTAGRAM',
          identifier: username,
          isAuthorized: result.isAuthorized,
          createdAt: new Date().toISOString(),
          requests: 0,
          lastReset: new Date().toISOString(),
        };
        
        setIgAccounts(prev => [newAccount, ...prev]);
        setIgTotalCount(prev => prev + 1);
        
        // Then refresh the list to get the real data from server
        setTimeout(() => {
          fetchIgAccounts();
        }, 1000);
        
      } else {
        toast({
          title: "Предупреждение",
          description: `Instagram аккаунт @${username} добавлен, но требует дополнительной настройки`,
          variant: "default",
        });
        
        // Still add to list even if not fully verified
        const newAccount: ParserAccount = {
          id: Date.now(),
          platform: 'INSTAGRAM',
          identifier: username,
          isAuthorized: result.isAuthorized,
          createdAt: new Date().toISOString(),
          requests: 0,
          lastReset: new Date().toISOString(),
        };
        
        setIgAccounts(prev => [newAccount, ...prev]);
        setIgTotalCount(prev => prev + 1);
      }
      
    } catch (error) {
      logError("Error adding IG account:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить Instagram аккаунт",
        variant: "destructive",
      });
      throw error; // Re-throw for dialog handling
    } finally {
      setIsProcessing(false);
    }
  }, [fetchIgAccounts, toast]);

  // Delete Instagram account
  const deleteIgAccount = useCallback(async (sessionId: number) => {
    try {
      setIsProcessing(true);
      
      await deleteIgSession(sessionId);
      
      // Remove from local state
      setIgAccounts(prev => prev.filter(account => account.id !== sessionId));
      setIgTotalCount(prev => prev - 1);
      
      toast({
        title: "Успех",
        description: "Instagram аккаунт удален",
        variant: "default",
      });
      
    } catch (error) {
      logError("Error deleting IG account:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить Instagram аккаунт",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  // Logout Instagram account
  const logoutIgAccount = useCallback(async (sessionId: number) => {
    try {
      setIsProcessing(true);
      
      await logoutIgSession(sessionId);
      
      // Update local state
      setIgAccounts(prev => 
        prev.map(account => 
          account.id === sessionId 
            ? { ...account, isAuthorized: false }
            : account
        )
      );
      
      toast({
        title: "Успех",
        description: "Instagram аккаунт отключен",
        variant: "default",
      });
      
    } catch (error) {
      logError("Error logging out IG account:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось отключить Instagram аккаунт",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  // Add Telegram account (step 1)
  const addTgAccount = useCallback(async (phone: string, apiHash: string, apiId: number) => {
    try {
      setIsProcessing(true);
      
      const result = await loginTgAccount(phone, apiHash, apiId);
      
      if (result.isVerify) {
        toast({
          title: "Код отправлен",
          description: `Код подтверждения отправлен на номер ${phone}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Предупреждение",
          description: `Telegram аккаунт ${phone} требует дополнительной настройки`,
          variant: "default",
        });
      }
      
    } catch (error) {
      logError("Error adding TG account:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить Telegram аккаунт",
        variant: "destructive",
      });
      throw error; // Re-throw for dialog handling
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  // Confirm Telegram account (step 2)
  const confirmTgAccount = useCallback(async (phone: string, code: string) => {
    try {
      setIsProcessing(true);
      
      const result = await confirmTgLogin(phone, code);
      
      if (result.isAuthorized && result.isVerify) {
        toast({
          title: "Успех",
          description: `Telegram аккаунт ${phone} успешно добавлен`,
          variant: "default",
        });
        
        // Add optimistic update - add the account to the list immediately
        const newAccount: ParserAccount = {
          id: Date.now(), // Temporary ID
          platform: 'TELEGRAM',
          identifier: phone,
          isAuthorized: result.isAuthorized,
          createdAt: new Date().toISOString(),
        };
        
        // Note: We don't have a tgAccounts state yet, but we can prepare for future implementation
        // For now, we'll just show success message
        
      } else {
        toast({
          title: "Предупреждение",
          description: `Telegram аккаунт ${phone} добавлен, но требует дополнительной настройки`,
          variant: "default",
        });
      }
      
    } catch (error) {
      logError("Error confirming TG account:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось подтвердить Telegram аккаунт",
        variant: "destructive",
      });
      throw error; // Re-throw for dialog handling
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  return {
    // Instagram accounts
    igAccounts,
    igLoading,
    igError,
    igHasMore,
    igTotalCount,
    fetchIgAccounts,
    loadMoreIgAccounts,
    addIgAccount,
    deleteIgAccount,
    logoutIgAccount,
    
    // Telegram accounts
    addTgAccount,
    confirmTgAccount,
    
    // General
    isProcessing,
  };
};
