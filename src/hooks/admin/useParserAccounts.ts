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
import {
  getTgSessions,
  deleteTgSession,
  logoutTgSession,
  type GetTgSessionsParams,
} from "@/api/endpoints/telegram";
import {
  getYtSessions,
  addYtSession,
  deleteYtSession,
  type GetYtSessionsParams,
} from "@/api/endpoints/youtube";
import type {
  ParserPlatform,
  ParserAccount,
  IgClientSessionsOutputDto,
  GetIgSessionsParams,
  TgClientSessionsOutputDto,
  YtClientSessionOutputDto,
} from "@/api/types";

interface UseParserAccountsReturn {
  // Instagram accounts
  igAccounts: ParserAccount[];
  igLoading: boolean;
  igError: string | null;
  igHasMore: boolean;
  igTotalCount: number;
  fetchIgAccounts: (params?: GetIgSessionsParams) => Promise<void>;
  loadMoreIgAccounts: (params?: GetIgSessionsParams) => Promise<void>;
  addIgAccount: (username: string, password: string) => Promise<void>;
  deleteIgAccount: (sessionId: number) => Promise<void>;
  logoutIgAccount: (sessionId: number) => Promise<void>;
  reauthIgAccount: (sessionId: number, username: string, password: string) => Promise<void>;
  
  // Telegram accounts
  tgAccounts: ParserAccount[];
  tgLoading: boolean;
  tgError: string | null;
  tgHasMore: boolean;
  tgTotalCount: number;
  fetchTgAccounts: (params?: GetTgSessionsParams) => Promise<void>;
  loadMoreTgAccounts: (params?: GetTgSessionsParams) => Promise<void>;
  addTgAccount: (phone: string, apiHash: string, apiId: number) => Promise<void>;
  confirmTgAccount: (phone: string, code: string) => Promise<void>;
  deleteTgAccount: (sessionId: number) => Promise<void>;
  logoutTgAccount: (sessionId: number) => Promise<void>;
  reauthTgAccount: (sessionId: number, phone: string, code: string) => Promise<void>;
  
  // YouTube accounts
  ytAccounts: ParserAccount[];
  ytLoading: boolean;
  ytError: string | null;
  ytHasMore: boolean;
  ytTotalCount: number;
  fetchYtAccounts: (params?: GetYtSessionsParams) => Promise<void>;
  loadMoreYtAccounts: (params?: GetYtSessionsParams) => Promise<void>;
  addYtAccount: (token: string, name: string) => Promise<void>;
  deleteYtAccount: (sessionId: number) => Promise<void>;
  
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
  const [igCurrentFilters, setIgCurrentFilters] = useState<GetIgSessionsParams>({});
  
  // Telegram state
  const [tgAccounts, setTgAccounts] = useState<ParserAccount[]>([]);
  const [tgLoading, setTgLoading] = useState(false);
  const [tgError, setTgError] = useState<string | null>(null);
  const [tgHasMore, setTgHasMore] = useState(true);
  const [tgTotalCount, setTgTotalCount] = useState(0);
  const [tgCurrentPage, setTgCurrentPage] = useState(1);
  const [tgCurrentFilters, setTgCurrentFilters] = useState<GetTgSessionsParams>({});
  
  // YouTube state
  const [ytAccounts, setYtAccounts] = useState<ParserAccount[]>([]);
  const [ytLoading, setYtLoading] = useState(false);
  const [ytError, setYtError] = useState<string | null>(null);
  const [ytHasMore, setYtHasMore] = useState(true);
  const [ytTotalCount, setYtTotalCount] = useState(0);
  const [ytCurrentPage, setYtCurrentPage] = useState(1);
  const [ytCurrentFilters, setYtCurrentFilters] = useState<GetYtSessionsParams>({});
  
  // General state
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper functions to convert sessions to ParserAccount
  const convertIgSessionToAccount = (session: IgClientSessionsOutputDto): ParserAccount => ({
    id: session.id,
    platform: 'INSTAGRAM',
    identifier: session.username,
    isAuthorized: session.isAuthorized,
    createdAt: session.createdAt,
    requests: session.requests,
    lastReset: session.lastReset,
  });

  const convertTgSessionToAccount = (session: TgClientSessionsOutputDto): ParserAccount => ({
    id: session.id,
    platform: 'TELEGRAM',
    identifier: session.phone,
    isAuthorized: session.isAuthorized,
    createdAt: session.createdAt,
    requests: session.requests,
    lastReset: session.lastReset,
  });

  const convertYtSessionToAccount = (session: YtClientSessionOutputDto): ParserAccount => ({
    id: session.id,
    platform: 'YOUTUBE',
    identifier: session.name || `Session ${session.id}`,
    isAuthorized: true, // YouTube sessions always authorized
    createdAt: session.createdAt,
  });

  // Fetch Instagram accounts
  const fetchIgAccounts = useCallback(async (params: GetIgSessionsParams = {}) => {
    try {
      setIgLoading(true);
      setIgError(null);
      
      const queryParams = {
        page: 1,
        size: 50,
        ...params,
      };
      
      // Save current filters
      setIgCurrentFilters(queryParams);
      
      const response = await getIgSessions(queryParams);
      
      // Debug logging removed
      
      // Детальное логирование каждого аккаунта
      response.items.forEach((session, index) => {
        // Session logging removed
      });
      
      const accounts = response.items.map(convertIgSessionToAccount);
      
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
  const loadMoreIgAccounts = useCallback(async (params: GetIgSessionsParams = {}) => {
    if (igLoading || !igHasMore) return;
    
    try {
      setIgLoading(true);
      
      // Merge current filters with new params (new params override current filters)
      const mergedParams = {
        ...igCurrentFilters,
        ...params,
        page: igCurrentPage + 1,
        size: 50,
      };
      
      const response = await getIgSessions(mergedParams);
      
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
  }, [igLoading, igHasMore, igCurrentPage, igCurrentFilters, toast]);

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
        
        // Обновляем список напрямую с сервера (предотвращает дублирование запросов)
        await fetchIgAccounts(igCurrentFilters);
        
      } else {
        toast({
          title: "Предупреждение",
          description: `Instagram аккаунт @${username} добавлен, но требует дополнительной настройки`,
          variant: "default",
        });
        
        // Обновляем список с сервера для получения актуальных данных
        await fetchIgAccounts(igCurrentFilters);
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
  }, [fetchIgAccounts, igCurrentFilters, toast]);

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

  // Reauth Instagram account
  const reauthIgAccount = useCallback(async (sessionId: number, username: string, password: string) => {
    try {
      setIsProcessing(true);
      
      // First, delete the old session
      await deleteIgSession(sessionId);
      
      // Remove from local state immediately
      setIgAccounts(prev => prev.filter(account => account.id !== sessionId));
      setIgTotalCount(prev => prev - 1);
      
      // Then, create a new session with the same credentials
      const result = await loginIgAccount(username, password);
      
      if (result.isAuthorized && result.isVerify) {
        toast({
          title: "Успех",
          description: `Instagram аккаунт @${username} успешно переавторизован`,
          variant: "default",
        });
        
        // Refresh the accounts list with current filters
        await fetchIgAccounts(igCurrentFilters);
      } else {
        toast({
          title: "Предупреждение",
          description: `Instagram аккаунт @${username} переавторизован, но требует дополнительной настройки`,
          variant: "default",
        });
        
        // Still refresh the list
        await fetchIgAccounts(igCurrentFilters);
      }
      
    } catch (error) {
      logError("Error reauthing IG account:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось переавторизовать Instagram аккаунт",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [fetchIgAccounts, igCurrentFilters, toast]);

  // Fetch Telegram accounts
  const fetchTgAccounts = useCallback(async (params: GetTgSessionsParams = {}) => {
    try {
      setTgLoading(true);
      setTgError(null);
      
      const queryParams = {
        page: 1,
        size: 50,
        ...params,
      };
      
      setTgCurrentFilters(queryParams);
      
      const response = await getTgSessions(queryParams);
      const accounts = response.items.map(convertTgSessionToAccount);
      
      setTgAccounts(accounts);
      setTgTotalCount(response.totalCount);
      setTgHasMore(response.page < response.pagesCount);
      setTgCurrentPage(1);
      
    } catch (error) {
      logError("Error fetching TG accounts:", error);
      setTgError("Не удалось загрузить аккаунты Telegram");
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить аккаунты Telegram",
        variant: "destructive",
      });
    } finally {
      setTgLoading(false);
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
        
        // Обновляем список с текущими фильтрами (предотвращает дублирование запросов)
        await fetchTgAccounts(tgCurrentFilters);
        
      } else {
        toast({
          title: "Предупреждение",
          description: `Telegram аккаунт ${phone} добавлен, но требует дополнительной настройки`,
          variant: "default",
        });
        
        // Обновляем список для получения актуальных данных
        await fetchTgAccounts(tgCurrentFilters);
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
  }, [fetchTgAccounts, tgCurrentFilters, toast]);

  // Load more Telegram accounts
  const loadMoreTgAccounts = useCallback(async (params: GetTgSessionsParams = {}) => {
    if (tgLoading || !tgHasMore) return;
    
    try {
      setTgLoading(true);
      
      const mergedParams = {
        ...tgCurrentFilters,
        ...params,
        page: tgCurrentPage + 1,
        size: 50,
      };
      
      const response = await getTgSessions(mergedParams);
      const newAccounts = response.items.map(convertTgSessionToAccount);
      
      setTgAccounts(prev => [...prev, ...newAccounts]);
      setTgHasMore(response.page < response.pagesCount);
      setTgCurrentPage(prev => prev + 1);
      
    } catch (error) {
      logError("Error loading more TG accounts:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить дополнительные аккаунты",
        variant: "destructive",
      });
    } finally {
      setTgLoading(false);
    }
  }, [tgLoading, tgHasMore, tgCurrentPage, tgCurrentFilters, toast]);

  // Delete Telegram account
  const deleteTgAccount = useCallback(async (sessionId: number) => {
    try {
      setIsProcessing(true);
      
      await deleteTgSession(sessionId);
      
      setTgAccounts(prev => prev.filter(account => account.id !== sessionId));
      setTgTotalCount(prev => prev - 1);
      
      toast({
        title: "Успех",
        description: "Telegram аккаунт удален",
        variant: "default",
      });
      
    } catch (error) {
      logError("Error deleting TG account:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить Telegram аккаунт",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  // Logout Telegram account
  const logoutTgAccount = useCallback(async (sessionId: number) => {
    try {
      setIsProcessing(true);
      
      await logoutTgSession(sessionId);
      
      setTgAccounts(prev => 
        prev.map(account => 
          account.id === sessionId 
            ? { ...account, isAuthorized: false }
            : account
        )
      );
      
      toast({
        title: "Успех",
        description: "Telegram аккаунт отключен",
        variant: "default",
      });
      
    } catch (error) {
      logError("Error logging out TG account:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось отключить Telegram аккаунт",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  // Reauth Telegram account
  const reauthTgAccount = useCallback(async (
    sessionId: number,
    phone: string,
    code: string
  ) => {
    try {
      setIsProcessing(true);
      
      if (!code) {
        // Step 1: Delete old session and trigger login with stored apiHash/apiId
        // Backend should use stored credentials for this phone number
        await deleteTgSession(sessionId);
        
        // Remove from local state immediately
        setTgAccounts(prev => prev.filter(account => account.id !== sessionId));
        setTgTotalCount(prev => prev - 1);
        
        // Try to confirm/login using stored apiHash/apiId from backend
        // Backend should handle re-login automatically using stored credentials
        toast({
          title: "Запрос отправлен",
          description: `Код подтверждения будет отправлен на номер ${phone}. Введите код в диалоге.`,
          variant: "default",
        });
        
        // Return early - wait for user to enter code
        return;
      } else {
        // Step 2: Confirm with code using stored apiHash/apiId
        const result = await confirmTgLogin(phone, code);
        
        if (result.isAuthorized && result.isVerify) {
          toast({
            title: "Успех",
            description: `Telegram аккаунт ${phone} успешно переавторизован`,
            variant: "default",
          });
          
          // Refresh the accounts list with current filters
          await fetchTgAccounts(tgCurrentFilters);
        } else {
          toast({
            title: "Предупреждение",
            description: `Telegram аккаунт ${phone} переавторизован, но требует дополнительной настройки`,
            variant: "default",
          });
          
          // Still refresh the list
          await fetchTgAccounts(tgCurrentFilters);
        }
      }
      
    } catch (error) {
      logError("Error reauthing TG account:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось переавторизовать Telegram аккаунт. Убедитесь, что код верный.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [fetchTgAccounts, tgCurrentFilters, toast]);

  // Fetch YouTube accounts
  const fetchYtAccounts = useCallback(async (params: GetYtSessionsParams = {}) => {
    try {
      setYtLoading(true);
      setYtError(null);
      
      const queryParams = {
        page: 1,
        size: 50,
        ...params,
      };
      
      setYtCurrentFilters(queryParams);
      
      const response = await getYtSessions(queryParams);
      const accounts = response.items.map(convertYtSessionToAccount);
      
      setYtAccounts(accounts);
      setYtTotalCount(response.totalCount);
      setYtHasMore(response.page < response.pagesCount);
      setYtCurrentPage(1);
      
    } catch (error) {
      logError("Error fetching YT accounts:", error);
      setYtError("Не удалось загрузить аккаунты YouTube");
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить аккаунты YouTube",
        variant: "destructive",
      });
    } finally {
      setYtLoading(false);
    }
  }, [toast]);

  // Load more YouTube accounts
  const loadMoreYtAccounts = useCallback(async (params: GetYtSessionsParams = {}) => {
    if (ytLoading || !ytHasMore) return;
    
    try {
      setYtLoading(true);
      
      const mergedParams = {
        ...ytCurrentFilters,
        ...params,
        page: ytCurrentPage + 1,
        size: 50,
      };
      
      const response = await getYtSessions(mergedParams);
      const newAccounts = response.items.map(convertYtSessionToAccount);
      
      setYtAccounts(prev => [...prev, ...newAccounts]);
      setYtHasMore(response.page < response.pagesCount);
      setYtCurrentPage(prev => prev + 1);
      
    } catch (error) {
      logError("Error loading more YT accounts:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить дополнительные аккаунты",
        variant: "destructive",
      });
    } finally {
      setYtLoading(false);
    }
  }, [ytLoading, ytHasMore, ytCurrentPage, ytCurrentFilters, toast]);

  // Add YouTube account
  const addYtAccount = useCallback(async (token: string, name: string) => {
    try {
      setIsProcessing(true);
      
      await addYtSession({ token, name });
      
      toast({
        title: "Успех",
        description: `YouTube сессия "${name}" успешно добавлена`,
        variant: "default",
      });
      
      // Обновляем список с текущими фильтрами (предотвращает дублирование запросов)
      await fetchYtAccounts(ytCurrentFilters);
      
    } catch (error) {
      logError("Error adding YT account:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить YouTube сессию",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [fetchYtAccounts, ytCurrentFilters, toast]);

  // Delete YouTube account
  const deleteYtAccount = useCallback(async (sessionId: number) => {
    try {
      setIsProcessing(true);
      
      await deleteYtSession(sessionId);
      
      setYtAccounts(prev => prev.filter(account => account.id !== sessionId));
      setYtTotalCount(prev => prev - 1);
      
      toast({
        title: "Успех",
        description: "YouTube сессия удалена",
        variant: "default",
      });
      
    } catch (error) {
      logError("Error deleting YT account:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить YouTube сессию",
        variant: "destructive",
      });
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
    reauthIgAccount,
    
    // Telegram accounts
    tgAccounts,
    tgLoading,
    tgError,
    tgHasMore,
    tgTotalCount,
    fetchTgAccounts,
    loadMoreTgAccounts,
    addTgAccount,
    confirmTgAccount,
    deleteTgAccount,
    logoutTgAccount,
    reauthTgAccount,
    
    // YouTube accounts
    ytAccounts,
    ytLoading,
    ytError,
    ytHasMore,
    ytTotalCount,
    fetchYtAccounts,
    loadMoreYtAccounts,
    addYtAccount,
    deleteYtAccount,
    
    // General
    isProcessing,
  };
};
