import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { REDIRECT_URL } from "@/config/constants";
import { useErrorHandler } from "@/utils/errorHandler";

interface UseAuthFormProps {
  mode: "login" | "register";
  onSuccess?: () => void;
}

export const useAuthForm = ({ mode, onSuccess }: UseAuthFormProps) => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler({
    navigate,
    showNotifications: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError("");

      try {
        if (mode === "login") {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            setError(error.message);
          } else {
            onSuccess?.();
            navigate("/");
          }
        } else {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: REDIRECT_URL,
            },
          });

          if (error) {
            setError(error.message);
          } else {
            navigate("/email-confirmation");
          }
        }
      } catch (err) {
        const processedError = handleError(err, {
          showNotification: false,
          logError: true,
        });
        setError(processedError.message);
      } finally {
        setLoading(false);
      }
    },
    [mode, navigate, handleError, onSuccess],
  );

  const handleGoogleAuth = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: REDIRECT_URL,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      const processedError = handleError(err, {
        showNotification: false,
        logError: true,
      });
      setError(processedError.message);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  return {
    loading,
    error,
    handleSubmit,
    handleGoogleAuth,
  };
};
