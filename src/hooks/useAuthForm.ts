import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { REDIRECT_URL } from "@/config/constants";

interface UseAuthFormProps {
  mode: "login" | "register";
  onSuccess?: () => void;
}

export const useAuthForm = ({ mode, onSuccess }: UseAuthFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError("");

      try {
        const authFn = mode === "login" 
          ? () => supabase.auth.signInWithPassword({ email, password })
          : () => supabase.auth.signUp({ email, password, options: { emailRedirectTo: REDIRECT_URL } });
        
        const { error } = await authFn();
        
        if (error) {
          setError(error.message);
        } else if (mode === "login") {
          onSuccess?.();
        } else {
          navigate("/email-confirmation");
        }
      } finally {
        setLoading(false);
      }
    },
    [mode, navigate, onSuccess],
  );

  const handleGoogleAuth = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: REDIRECT_URL },
      });
      if (error) setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, handleSubmit, handleGoogleAuth };
};