export function normalizeUsername(username: string | undefined | null): string {
  return username?.replace("@", "").trim() || "";
}

export function formatUsernameForDisplay(
  username: string | undefined | null,
): string {
  const normalized = normalizeUsername(username);
  return normalized ? `@${normalized}` : "";
}
