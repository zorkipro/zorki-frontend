import { AuthForm } from "@/components/auth/AuthForm.tsx";
import { useAuthForm } from "@/hooks/useAuthForm.ts";

const Register = () => {
  const { loading, error, handleSubmit, handleGoogleAuth } = useAuthForm({
    mode: "register",
  });

  return (
    <AuthForm
      mode="register"
      onSubmit={handleSubmit}
      onGoogleAuth={handleGoogleAuth}
      loading={loading}
      error={error}
      showForgotPassword={false}
    />
  );
};

export default Register;