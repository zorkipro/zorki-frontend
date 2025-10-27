import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Label } from "@/ui-kit";
import { Shield, ArrowLeft, Clock } from "lucide-react";
import { adminConfirm2FA } from "@/api/endpoints/admin.ts";
import { APIError } from "@/api/client.ts";

const AdminTwoFactor = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 минут
  const [codeExpired, setCodeExpired] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Проверяем наличие временного токена для 2FA
  useEffect(() => {
    const tempToken = sessionStorage.getItem("adminTempToken");
    console.log("🔍 AdminTwoFactor Check:", {
      tempTokenExists: !!tempToken,
      tempTokenLength: tempToken?.length,
      tempTokenPrefix: tempToken ? tempToken.substring(0, 20) + "..." : "none"
    });
    
    if (!tempToken) {
      console.log("❌ No temp token found, redirecting to login");
      navigate("/admin/login");
    }
  }, [navigate]);

  // Таймер обратного отсчета для кода
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCodeExpired(true);
          setCode(["", "", "", "", "", ""]); // Очищаем поля
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Форматирование времени
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Обработка изменения кода
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Только одна цифра

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Автоматический переход к следующему полю
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Обработка клавиш
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Обработка вставки кода
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newCode = [...code];

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }

    setCode(newCode);

    // Фокус на последнее заполненное поле
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  // Проверка кода
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (codeExpired) {
      setError("Время действия кода истекло. Запросите новый код.");
      return;
    }

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Введите полный код из 6 цифр");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ Реальная проверка 2FA через API
      const { accessToken } = await adminConfirm2FA(parseInt(fullCode, 10));

      // Сохраняем полный токен и очищаем временный
      sessionStorage.setItem("adminToken", accessToken);
      sessionStorage.removeItem("adminTempToken");

      // Переходим в админку
      navigate("/admin");
    } catch (err: unknown) {
      // Обработка ошибок API
      if (err instanceof APIError) {
        if (err.statusCode === 400) {
          setError("Неверный код подтверждения. Попробуйте ещё раз.");
        } else if (err.statusCode === 401) {
          setError("Время действия сессии истекло. Войдите заново.");
          sessionStorage.removeItem("adminTempToken"); // Очищаем только temp токен
          setTimeout(() => {
            navigate("/admin/login");
          }, 2000);
        } else {
          setError(err.message);
        }
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Произошла ошибка при проверке кода",
        );
      }

      // Очищаем поля только при 400 (неверный код)
      if (err instanceof APIError && err.statusCode === 400) {
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  // Возврат назад
  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Двухфакторная аутентификация
            </h1>
            <p className="text-gray-600">
              Введите код из вашего приложения двухфакторной аутентификации
            </p>
          </div>

          {/* Таймер */}
          <div className="flex items-center justify-center mb-6">
            <Clock
              className={`w-5 h-5 mr-2 ${codeExpired ? "text-red-500" : "text-orange-500"}`}
            />
            <span
              className={`text-sm font-medium ${codeExpired ? "text-red-500" : "text-gray-700"}`}
            >
              {codeExpired
                ? "Время действия кода истекло"
                : `Код действителен: ${formatTime(timeLeft)}`}
            </span>
          </div>

          {/* Форма ввода кода */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label className="text-center block text-sm font-medium text-gray-700">
                Код подтверждения
              </Label>

              <div className="flex justify-center space-x-3">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-bold border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    disabled={loading || codeExpired}
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                disabled={loading || code.join("").length !== 6 || codeExpired}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Проверка...
                  </div>
                ) : (
                  "Подтвердить"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleBack}
                disabled={loading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminTwoFactor;
