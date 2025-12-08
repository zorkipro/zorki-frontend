// Supabase client for authentication only
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

// Проверка конфигурации
if (!SUPABASE_URL) {
  console.error("❌ VITE_SUPABASE_URL не установлен в переменных окружения");
}
if (!SUPABASE_PUBLISHABLE_KEY) {
  console.error("❌ VITE_SUPABASE_PUBLISHABLE_KEY и VITE_SUPABASE_ANON_KEY не установлены");
}

// Логирование для отладки (только в режиме разработки)
if (import.meta.env.DEV) {
  console.log("🔧 Supabase конфигурация:", {
    url: SUPABASE_URL,
    hasKey: !!SUPABASE_PUBLISHABLE_KEY,
    keyLength: SUPABASE_PUBLISHABLE_KEY?.length || 0,
    expectedUrl: "https://db.zorki.pro",
    isCorrectUrl: SUPABASE_URL === "https://db.zorki.pro",
  });
  
  // Предупреждение, если URL неправильный
  if (SUPABASE_URL !== "https://db.zorki.pro") {
    console.warn("⚠️ ВНИМАНИЕ: URL Supabase не соответствует ожидаемому!");
    console.warn("   Ожидается: https://db.zorki.pro");
    console.warn("   Получено:", SUPABASE_URL);
    console.warn("   Проверьте файлы: .env, .env.local, env.local, dev-config.env");
  }
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Создаем единый экземпляр клиента для избежания множественных экземпляров
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    const CLEANUP_FLAG = "supabase-cleanup";
    
    if (!localStorage.getItem(CLEANUP_FLAG)) {
      try {
        // Очищаем только ключи, связанные со старым проектом
        const oldProjectRef = "lyeukzcohzufapmtajcl";
        const currentStorageKey = "sb-zorki7-anon";
        const keysToRemove: string[] = [];
        
        // Собираем все ключи, связанные со старым проектом
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            if (key.includes(oldProjectRef) && key !== currentStorageKey) {
              keysToRemove.push(key);
            }
          }
        }
        // Удаляем найденные ключи
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });
        
        // Также удаляем ключи со старым URL
        const oldUrl = "https://lyeukzcohzufapmtajcl.supabase.co";
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key !== currentStorageKey) {
              const value = localStorage.getItem(key);
              if (value && typeof value === 'string' && value.includes(oldUrl)) {
                keysToRemove.push(key);
                localStorage.removeItem(key);
            }
          }
        }
        localStorage.setItem(CLEANUP_FLAG, "true");
      } catch (error) {
        console.warn("⚠️ Ошибка при очистке старых данных:", error);
      }
    }

    // Проверяем, что URL правильный
    if (SUPABASE_URL && SUPABASE_URL.includes("lyeukzcohzufapmtajcl")) {
      console.error("❌ Обнаружен старый URL Supabase! Проверьте переменные окружения.");
    }

    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        storageKey: "sb-zorki7-anon",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    
    // Дополнительная проверка в dev режиме
    if (import.meta.env.DEV) {
      console.log("✅ Supabase клиент создан с URL:", SUPABASE_URL);
    }
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
