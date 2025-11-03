import { AuthForm } from "@/components/auth/AuthForm.tsx";
import { useAuthForm } from "@/hooks/useAuthForm.ts";

const Login = () => {
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

export default Login;
