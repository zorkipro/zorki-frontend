import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthForm } from "@/hooks/useAuthForm";

export const Login = () => {
  const { loading, error, handleSubmit, handleGoogleAuth } = useAuthForm({
    mode: "login",
  });
  return (
    <AuthForm
      mode="login"
      onSubmit={handleSubmit}
      onGoogleAuth={handleGoogleAuth}
      loading={loading}
      error={error}
    />
  );
};
