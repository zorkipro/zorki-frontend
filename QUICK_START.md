# 🚀 Быстрый запуск

## ⚡ За 30 секунд

```bash
# 1. Установка
npm install

# 2. Запуск
npm run dev

# 3. Открыть: http://localhost:8080
```

## 🔧 Если что-то не работает

### Проблема с портом:
```bash
npm run dev -- --port 3000
```

### Проблема с зависимостями:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Проблема с Supabase:
```bash
# Проверьте переменные в dev-config.env
cat dev-config.env | grep VITE_SUPABASE
```

## 📖 Подробная документация

👉 [Полное руководство по запуску](docs/FRONTEND_SETUP.md)

---

_Последнее обновление: 17 января 2025_