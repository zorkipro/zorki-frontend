import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080, // Стандартный порт для разработки
    hmr: {
      overlay: false, // Отключаем overlay для ошибок HMR
      clientPort: 8080
    },
    proxy: {
      '/api': {
        target: 'https://zorki.pro',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path, // Не убираем /api из пути, т.к. бэкенд находится на /api
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
          });
        },
      }
    }
  },
  plugins: [
    react({
      // Настройки для React плагина
      // Отключаем автоматическое обновление для предотвращения циклов
      include: "**/*.{jsx,tsx}",
    }),
    // Временно отключаем componentTagger для устранения проблем с HMR
    // mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    // Предварительная оптимизация зависимостей для предотвращения циклических обновлений
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'lucide-react'
    ],
    exclude: ['lovable-tagger']
  },
  esbuild: {
    // Настройки для esbuild
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-avatar', '@radix-ui/react-checkbox', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'utility-vendor': ['lucide-react', 'clsx', 'tailwind-merge'],
          'supabase-vendor': ['@supabase/supabase-js'],
          
          // Feature chunks
          'profile-components': [
            './src/pages/ProfileEditor',
            './src/pages/BloggerProfile',
            './src/components/profile/ProfileHeader',
            './src/components/profile/PlatformStats',
            './src/components/profile/ScreenshotManagement'
          ],
          'dashboard-components': [
            './src/pages/Dashboard',
            './src/components/bloggers/BloggerTable',
            './src/components/filters/FilterSidebar'
          ],
          'auth-components': [
            './src/pages/Login',
            './src/pages/Register',
            './src/pages/EmailConfirmation',
            './src/contexts/AuthContext'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
}));
