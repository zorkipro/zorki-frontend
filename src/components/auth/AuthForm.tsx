import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/ui-kit";
import { Label } from "@/ui-kit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui-kit";
import { Mail } from "lucide-react";
import {
  GoogleAuthButton,
  InputWithIcon,
  PasswordInput,
  DividerWithText,
  CenteredAuthLayout,
  ErrorAlert,
} from "@/ui-kit/components";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleAuth: () => Promise<void>;
  loading: boolean;
  error: string;
  showForgotPassword?: boolean;
}

export const AuthForm = ({
  mode,
  onSubmit,
  onGoogleAuth,
  loading,
  error,
  showForgotPassword = true,
}: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  const isLogin = mode === "login";
  const title = isLogin ? "Добро пожаловать" : "Создать аккаунт";
  const description = isLogin
    ? "Войдите в свой аккаунт для продолжения"
    : "Зарегистрируйтесь для доступа к платформе";
  const buttonText = isLogin ? "Войти" : "Зарегистрироваться";
  const googleButtonText = isLogin
    ? "Войти через Google"
    : "Зарегистрироваться через Google";
  const linkText = isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?";
  const linkPath = isLogin ? "/register" : "/login";
  const linkLabel = isLogin ? "Зарегистрироваться" : "Войти";

  return (
    <CenteredAuthLayout>
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Button */}
          <GoogleAuthButton
            text={googleButtonText}
            onClick={onGoogleAuth}
            loading={loading}
          />

          <DividerWithText text="или" />

          {/* Error Message */}
          <ErrorAlert error={error} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <InputWithIcon
                id="email"
                type="email"
                icon={Mail}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={setPassword}
                placeholder={isLogin ? "Введите пароль" : "Создайте пароль"}
                required
              />
            </div>

            {showForgotPassword && isLogin && (
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-primary hover:text-primary/80"
                  >
                    Забыли пароль?
                  </Link>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:bg-primary-hover"
              disabled={loading}
            >
              {loading ? `${buttonText}...` : buttonText}
            </Button>
          </form>

          {/* Terms and Privacy */}
          <div className="text-center text-sm text-muted-foreground mb-4">
            <p className="mb-2">
              {isLogin
                ? "Рады видеть вас снова! Входя в систему, вы подтверждаете согласие с"
                : "Добро пожаловать! Регистрируясь на нашей платформе, вы принимаете"}{" "}
              <Link
                to="/terms"
                className="text-primary hover:text-primary/80 underline font-medium"
              >
                условиями использования
              </Link>{" "}
              и{" "}
              <Link
                to="/privacy"
                className="text-primary hover:text-primary/80 underline font-medium"
              >
                политикой конфиденциальности
              </Link>
            </p>
            {!isLogin && (
              <p className="text-xs text-muted-foreground/80">
                Мы заботимся о вашей безопасности и прозрачности наших отношений
              </p>
            )}
          </div>

          {/* Switch Mode Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">{linkText} </span>
            <Link
              to={linkPath}
              className="text-primary hover:text-primary/80 font-medium"
            >
              {linkLabel}
            </Link>
          </div>
        </CardContent>
      </Card>
    </CenteredAuthLayout>
  );
};
