import { safeSessionGet, safeSessionSet, safeSessionRemove } from "./storageUtils";

const CURRENT_STAFF_KEY = "currentStaff";

export function setSelectedStaffUsername(username: string): void {
  safeSessionSet(CURRENT_STAFF_KEY, username);
}

export function getSelectedStaffUsername(): string | null {
  return safeSessionGet(CURRENT_STAFF_KEY);
}

export function clearSelectedStaffUsername(): void {
  safeSessionRemove(CURRENT_STAFF_KEY);
}
