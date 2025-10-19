import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Label } from "@/ui-kit";
import { adminLogin } from "@/api/endpoints/admin";
import { APIError } from "@/api/client";
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Логин через Backend API
      const { accessToken } = await adminLogin({
        username,
        password,
      });

      // Добавляем логирование для отладки
      console.log("🔑 Admin Login Success:", {
        accessTokenLength: accessToken.length,
        accessTokenPrefix: accessToken.substring(0, 20) + "...",
        username
      });

      // Сохраняем временный токен для 2FA
      sessionStorage.setItem("adminTempToken", accessToken);

      // Переходим на страницу 2FA
      navigate("/admin/2fa");
    } catch (err: unknown) {
      // Обработка ошибок API
      if (err instanceof APIError) {
        if (err.statusCode === 401) {
          setError("Неверный логин или пароль");
        } else if (err.errorField) {
          // Validation errors
          const messages = err.errorField.map((e) => e.message).join(", ");
          setError(messages);
        } else {
          setError(err.message);
        }
      } else {
        setError(
          err instanceof Error ? err.message : "Произошла ошибка при входе",
        );
      }

      // Удаляем токены в случае ошибки
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminTempToken");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Вход в админ-панель
            </h1>
            <p className="text-gray-600">
              Введите учетные данные администратора
            </p>
          </div>

          {/* Форма логина */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Имя пользователя
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите имя пользователя"
                required
                disabled={loading}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Пароль
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
                disabled={loading}
                className="h-12"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12"
              disabled={loading || !username || !password}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Вход...
                </div>
              ) : (
                "Войти в админ-панель"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
