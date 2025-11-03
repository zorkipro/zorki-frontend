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
  const isLogin = mode === "login";

  const texts = {
    title: isLogin ? "Добро пожаловать" : "Создать аккаунт",
    description: isLogin
      ? "Войдите в свой аккаунт для продолжения"
      : "Зарегистрируйтесь для доступа к платформе",
    button: isLogin ? "Войти" : "Зарегистрироваться",
    googleButton: isLogin
      ? "Войти через Google"
      : "Зарегистрироваться через Google",
    linkText: isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?",
    linkPath: isLogin ? "/register" : "/login",
    linkLabel: isLogin ? "Зарегистрироваться" : "Войти",
    termsPrefix: isLogin
      ? "Рады видеть вас снова! Входя в систему, вы подтверждаете согласие с"
      : "Добро пожаловать! Регистрируясь на нашей платформе, вы принимаете",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <CenteredAuthLayout>
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{texts.title}</CardTitle>
          <CardDescription>{texts.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <GoogleAuthButton
            text={texts.googleButton}
            onClick={onGoogleAuth}
            loading={loading}
          />

          <DividerWithText text="или" />
          <ErrorAlert error={error} />

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
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="text-primary hover:text-primary/80"
                >
                  Забыли пароль?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:bg-primary-hover"
              disabled={loading}
            >
              {loading ? `${texts.button}...` : texts.button}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground mb-4">
            <p className="mb-2">
              {texts.termsPrefix}{" "}
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

          <div className="text-center text-sm">
            <span className="text-muted-foreground">{texts.linkText} </span>
            <Link
              to={texts.linkPath}
              className="text-primary hover:text-primary/80 font-medium"
            >
              {texts.linkLabel}
            </Link>
          </div>
        </CardContent>
      </Card>
    </CenteredAuthLayout>
  );
};
