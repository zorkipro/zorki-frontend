// Supabase client for authentication only
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Создаем единый экземпляр клиента для избежания множественных экземпляров
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    // Очищаем только старые неиспользуемые ключи, но не активную сессию
    try {
      // Удаляем только старые ключи, которые больше не используются
      localStorage.removeItem('sb-zorki7-auth-token');
      sessionStorage.removeItem('sb-zorki7-anon');
      // НЕ удаляем 'sb-zorki7-anon' из localStorage - это активная сессия
    } catch (error) {
      // Silent - old storage cleanup failed
    }

    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        storageKey: 'sb-zorki7-anon',
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseInstance;
})();

/**
 * Принудительно пересоздает Supabase клиент
 * Используется для очистки кэша и применения новых настроек
 */
export const recreateSupabaseClient = () => {
  supabaseInstance = null;
  return supabase;
};

// ============================================
// DEPRECATED: adminSupabase removed
// ============================================
// Admin operations now use backend API with JWT tokens
// All admin functionality has been moved to the backend
// Use admin API endpoints instead of direct Supabase access
// ============================================
