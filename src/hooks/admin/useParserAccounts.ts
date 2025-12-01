import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
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
  ParserAccount,
  IgClientSessionsOutputDto,
  GetIgSessionsParams,
  IgSessionsResponse,
  TgClientSessionsOutputDto,
  YtClientSessionOutputDto,
} from "@/api/types";
import type { TgSessionsResponse } from "@/api/endpoints/telegram";
import type { YtSessionsResponse } from "@/api/endpoints/youtube";

interface PlatformState<TParams = {}> {
  accounts: ParserAccount[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  currentFilters: TParams;
}

interface UseParserAccountsReturn {
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
  
  ytAccounts: ParserAccount[];
  ytLoading: boolean;
  ytError: string | null;
  ytHasMore: boolean;
  ytTotalCount: number;
  fetchYtAccounts: (params?: GetYtSessionsParams) => Promise<void>;
  loadMoreYtAccounts: (params?: GetYtSessionsParams) => Promise<void>;
  addYtAccount: (token: string, name: string) => Promise<void>;
  deleteYtAccount: (sessionId: number) => Promise<void>;
  
  isProcessing: boolean;
}

export const useParserAccounts = (): UseParserAccountsReturn => {
  const { toast } = useToast();
  
  const [igState, setIgState] = useState<PlatformState<GetIgSessionsParams>>({
    accounts: [],
    loading: false,
    error: null,
    hasMore: true,
    totalCount: 0,
    currentPage: 1,
    currentFilters: {},
  });
  
  const [tgState, setTgState] = useState<PlatformState<GetTgSessionsParams>>({
    accounts: [],
    loading: false,
    error: null,
    hasMore: true,
    totalCount: 0,
    currentPage: 1,
    currentFilters: {},
  });
  
  const [ytState, setYtState] = useState<PlatformState<GetYtSessionsParams>>({
    accounts: [],
    loading: false,
    error: null,
    hasMore: true,
    totalCount: 0,
    currentPage: 1,
    currentFilters: {},
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

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
    isAuthorized: true,
    createdAt: session.createdAt,
  });

  // Обобщенная функция для fetch
  const createFetchFunction = <TParams extends {}, TResponse extends { items: any[]; page: number; pagesCount: number; totalCount: number }>(
    setState: React.Dispatch<React.SetStateAction<PlatformState<TParams>>>,
    fetchFn: (params: TParams) => Promise<TResponse>,
    converter: (item: any) => ParserAccount,
    errorMsg: string,
    toastFn: ReturnType<typeof useToast>['toast']
  ) => async (params: TParams = {} as TParams) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const queryParams = { page: 1, size: 50, ...params } as TParams;
      const response = await fetchFn(queryParams);
      const accounts = response.items.map(converter);
      setState({
        accounts,
        loading: false,
        error: null,
        hasMore: response.page < response.pagesCount,
        totalCount: response.totalCount,
        currentPage: 1,
        currentFilters: queryParams,
      });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: errorMsg }));
      toastFn({ title: "Ошибка", description: errorMsg, variant: "destructive" });
    }
  };

  // Обобщенная функция для loadMore
  const createLoadMoreFunction = <TParams extends {}, TResponse extends { items: any[]; page: number; pagesCount: number }>(
    getState: () => PlatformState<TParams>,
    setState: React.Dispatch<React.SetStateAction<PlatformState<TParams>>>,
    fetchFn: (params: TParams) => Promise<TResponse>,
    converter: (item: any) => ParserAccount,
    toastFn: ReturnType<typeof useToast>['toast']
  ) => async (params: TParams = {} as TParams) => {
    const currentState = getState();
    if (currentState.loading || !currentState.hasMore) return;
    
    try {
      setState(prev => ({ ...prev, loading: true }));
      const mergedParams = { ...currentState.currentFilters, ...params, page: currentState.currentPage + 1, size: 50 } as TParams;
      const response = await fetchFn(mergedParams);
      const newAccounts = response.items.map(converter);
      setState(prev => ({
        ...prev,
        accounts: [...prev.accounts, ...newAccounts],
        loading: false,
        hasMore: response.page < response.pagesCount,
        currentPage: prev.currentPage + 1,
      }));
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      toastFn({ title: "Ошибка", description: "Не удалось загрузить дополнительные аккаунты", variant: "destructive" });
    }
  };

  const createDeleteFunction = <TParams extends {}>(
    setState: React.Dispatch<React.SetStateAction<PlatformState<TParams>>>,
    deleteFn: (id: number) => Promise<void>,
    successMsg: string,
    errorMsg: string
  ) => useCallback(async (sessionId: number) => {
    try {
      setIsProcessing(true);
      await deleteFn(sessionId);
      setState(prev => ({
        ...prev,
        accounts: prev.accounts.filter(acc => acc.id !== sessionId),
        totalCount: prev.totalCount - 1,
      }));
      toast({ title: "Успех", description: successMsg });
    } catch (_) {
      toast({ title: "Ошибка", description: errorMsg, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  }, [toast, setState]);

  const createLogoutFunction = (
    setState: React.Dispatch<React.SetStateAction<PlatformState<any>>>,
    logoutFn: (id: number) => Promise<void>,
    successMsg: string,
    errorMsg: string
  ) => useCallback(async (sessionId: number) => {
    try {
      setIsProcessing(true);
      await logoutFn(sessionId);
      setState(prev => ({
        ...prev,
        accounts: prev.accounts.map(acc => acc.id === sessionId ? { ...acc, isAuthorized: false } : acc),
      }));
      toast({ title: "Успех", description: successMsg });
    } catch (_) {
      toast({ title: "Ошибка", description: errorMsg, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  }, [toast, setState]);

  const fetchIgAccounts = createFetchFunction(
    setIgState,
    getIgSessions,
    convertIgSessionToAccount,
    "Не удалось загрузить аккаунты Instagram",
    toast
  );

  const fetchTgAccounts = createFetchFunction(
    setTgState,
    getTgSessions,
    convertTgSessionToAccount,
    "Не удалось загрузить аккаунты Telegram",
    toast
  );

  const fetchYtAccounts = createFetchFunction(
    setYtState,
    getYtSessions,
    convertYtSessionToAccount,
    "Не удалось загрузить аккаунты YouTube",
    toast
  );

  const loadMoreIgAccounts = createLoadMoreFunction(
    () => igState,
    setIgState,
    getIgSessions,
    convertIgSessionToAccount,
    toast
  );

  const loadMoreTgAccounts = createLoadMoreFunction(
    () => tgState,
    setTgState,
    getTgSessions,
    convertTgSessionToAccount,
    toast
  );

  const loadMoreYtAccounts = createLoadMoreFunction(
    () => ytState,
    setYtState,
    getYtSessions,
    convertYtSessionToAccount,
    toast
  );

  const deleteIgAccount = createDeleteFunction(
    setIgState,
    deleteIgSession,
    "Instagram аккаунт удален",
    "Не удалось удалить Instagram аккаунт"
  );

  const deleteTgAccount = createDeleteFunction(
    setTgState,
    deleteTgSession,
    "Telegram аккаунт удален",
    "Не удалось удалить Telegram аккаунт"
  );

  const deleteYtAccount = createDeleteFunction(
    setYtState,
    deleteYtSession,
    "YouTube сессия удалена",
    "Не удалось удалить YouTube сессию"
  );

  const logoutIgAccount = createLogoutFunction(
    setIgState,
    logoutIgSession,
    "Instagram аккаунт отключен",
    "Не удалось отключить Instagram аккаунт"
  );

  const logoutTgAccount = createLogoutFunction(
    setTgState,
    logoutTgSession,
    "Telegram аккаунт отключен",
    "Не удалось отключить Telegram аккаунт"
  );

  const addIgAccount = useCallback(async (username: string, password: string) => {
    try {
      setIsProcessing(true);
      const result = await loginIgAccount(username, password);
      const success = result.isAuthorized && result.isVerify;
      toast({
        title: success ? "Успех" : "Предупреждение",
        description: success 
          ? `Instagram аккаунт @${username} успешно добавлен`
          : `Instagram аккаунт @${username} добавлен, но требует дополнительной настройки`,
      });
      await fetchIgAccounts(igState.currentFilters);
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось добавить Instagram аккаунт", variant: "destructive" });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [fetchIgAccounts, igState.currentFilters, toast]);

  const reauthIgAccount = useCallback(async (sessionId: number, username: string, password: string) => {
    try {
      setIsProcessing(true);
      const result = await loginIgAccount(username, password);
      const success = result.isAuthorized && result.isVerify;
      toast({
        title: success ? "Успех" : "Предупреждение",
        description: success
          ? `Instagram аккаунт @${username} успешно переавторизован`
          : `Instagram аккаунт @${username} переавторизован, но требует дополнительной настройки`,
      });
      await fetchIgAccounts(igState.currentFilters);
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось переавторизовать Instagram аккаунт", variant: "destructive" });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [fetchIgAccounts, igState.currentFilters, toast]);

  const addTgAccount = useCallback(async (phone: string, apiHash: string, apiId: number) => {
    try {
      setIsProcessing(true);
      const result = await loginTgAccount(phone, apiHash, apiId);
      toast({
        title: result.isVerify ? "Код отправлен" : "Предупреждение",
        description: result.isVerify
          ? `Код подтверждения отправлен на номер ${phone}`
          : `Telegram аккаунт ${phone} требует дополнительной настройки`,
      });
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось добавить Telegram аккаунт", variant: "destructive" });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const confirmTgAccount = useCallback(async (phone: string, code: string) => {
    try {
      setIsProcessing(true);
      const result = await confirmTgLogin(phone, code);
      const success = result.isAuthorized && result.isVerify;
      toast({
        title: success ? "Успех" : "Предупреждение",
        description: success
          ? `Telegram аккаунт ${phone} успешно добавлен`
          : `Telegram аккаунт ${phone} добавлен, но требует дополнительной настройки`,
      });
      await fetchTgAccounts(tgState.currentFilters);
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось подтвердить Telegram аккаунт", variant: "destructive" });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [fetchTgAccounts, tgState.currentFilters, toast]);

  const reauthTgAccount = useCallback(async (sessionId: number, phone: string, code: string) => {
    try {
      setIsProcessing(true);
      if (!code) {
        await deleteTgSession(sessionId);
        setTgState(prev => ({
          ...prev,
          accounts: prev.accounts.filter(acc => acc.id !== sessionId),
          totalCount: prev.totalCount - 1,
        }));
        toast({
          title: "Запрос отправлен",
          description: `Код подтверждения будет отправлен на номер ${phone}. Введите код в диалоге.`,
        });
        return;
      }
      const result = await confirmTgLogin(phone, code);
      const success = result.isAuthorized && result.isVerify;
      toast({
        title: success ? "Успех" : "Предупреждение",
        description: success
          ? `Telegram аккаунт ${phone} успешно переавторизован`
          : `Telegram аккаунт ${phone} переавторизован, но требует дополнительной настройки`,
      });
      await fetchTgAccounts(tgState.currentFilters);
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось переавторизовать Telegram аккаунт. Убедитесь, что код верный.", variant: "destructive" });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [fetchTgAccounts, tgState.currentFilters, toast]);

  const addYtAccount = useCallback(async (token: string, name: string) => {
    try {
      setIsProcessing(true);
      await addYtSession({ token, name });
      toast({ title: "Успех", description: `YouTube сессия "${name}" успешно добавлена` });
      await fetchYtAccounts(ytState.currentFilters);
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось добавить YouTube сессию", variant: "destructive" });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [fetchYtAccounts, ytState.currentFilters, toast]);

  return {
    igAccounts: igState.accounts,
    igLoading: igState.loading,
    igError: igState.error,
    igHasMore: igState.hasMore,
    igTotalCount: igState.totalCount,
    fetchIgAccounts,
    loadMoreIgAccounts,
    addIgAccount,
    deleteIgAccount,
    logoutIgAccount,
    reauthIgAccount,
    
    tgAccounts: tgState.accounts,
    tgLoading: tgState.loading,
    tgError: tgState.error,
    tgHasMore: tgState.hasMore,
    tgTotalCount: tgState.totalCount,
    fetchTgAccounts,
    loadMoreTgAccounts,
    addTgAccount,
    confirmTgAccount,
    deleteTgAccount,
    logoutTgAccount,
    reauthTgAccount,
    
    ytAccounts: ytState.accounts,
    ytLoading: ytState.loading,
    ytError: ytState.error,
    ytHasMore: ytState.hasMore,
    ytTotalCount: ytState.totalCount,
    fetchYtAccounts,
    loadMoreYtAccounts,
    addYtAccount,
    deleteYtAccount,
    
    isProcessing,
  };
};
