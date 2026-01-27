export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function safeSessionGet(key: string): string | null {
  if (!isBrowser()) return null;
  return window.sessionStorage.getItem(key);
}

export function safeSessionSet(key: string, value: string): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(key, value);
}

export function safeSessionRemove(key: string): void {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(key);
}