import { Staff } from "~/domain/entities/Staff";
import { safeSessionGet, safeSessionSet, safeSessionRemove } from "./storageUtils";

export type UserSession = Omit<Staff, "password">;

export const USER_SESSION_KEY = "userSession";

export function setUserSession(staff: Staff): void {
  const { password, ...sessionData } = staff;
  safeSessionSet(USER_SESSION_KEY, JSON.stringify(sessionData));
}

export function getUserSession(): UserSession | null {
  const raw = safeSessionGet(USER_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserSession;
  } catch (error) {
    console.warn("Failed to parse user session. Clearing session.", error);
    clearUserSession();
    return null;
  }
}

export function clearUserSession(): void {
  safeSessionRemove(USER_SESSION_KEY);
}

export function updateUserSession(partial: Partial<UserSession>): void {
  const current = getUserSession();
  if (!current) return;
  const nextSession = { ...current, ...partial };
  safeSessionSet(USER_SESSION_KEY, JSON.stringify(nextSession));
}
