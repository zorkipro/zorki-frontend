/**
 * AUTH COMPONENTS - Компоненты авторизации
 *
 * Универсальные компоненты для страниц авторизации
 */

export { GoogleAuthButton } from "./GoogleAuthButton";
export type { GoogleAuthButtonProps } from "./GoogleAuthButton";

export { InputWithIcon } from "./InputWithIcon";
export type { InputWithIconProps } from "./InputWithIcon";

export { PasswordInput } from "./PasswordInput";
export type { PasswordInputProps } from "./PasswordInput";

export { DividerWithText } from "./DividerWithText";
export type { DividerWithTextProps } from "./DividerWithText";

// Новые компоненты для системы авторизации
export { ProtectedRoute } from "@/components/ProtectedRoute";
export { default as ErrorNotification } from "@/components/auth/ErrorNotification";
export { useErrorNotification } from "@/hooks/useErrorNotification";
