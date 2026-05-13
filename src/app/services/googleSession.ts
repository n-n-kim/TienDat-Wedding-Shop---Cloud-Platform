import type { User } from '../contexts/AuthContext';

const USER_STORAGE_KEY = 'user';
const EXPIRY_SKEW_MS = 30_000;
export const AUTH_SESSION_EVENT = 'app-auth-session-changed';

interface JwtPayload {
  exp?: number;
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    clearStoredUser();
    return null;
  }
}

export function setStoredUser(user: User) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  emitAuthSessionEvent();
}

export function clearStoredUser() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(USER_STORAGE_KEY);
  emitAuthSessionEvent();
}

export function hasValidGoogleIdToken(token?: string | null) {
  return Boolean(token) && !isGoogleIdTokenExpired(token);
}

export function isGoogleIdTokenExpired(token: string, nowMs = Date.now()) {
  const payload = decodeJwtPayload<JwtPayload>(token);

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= nowMs + EXPIRY_SKEW_MS;
}

export function getGoogleSessionErrorMessage(language?: string) {
  return language === 'vi'
    ? 'Phien dang nhap Google da het han. Vui long dang nhap lai.'
    : 'Your Google sign-in session has expired. Please sign in again.';
}

function decodeJwtPayload<T>(token: string): T | null {
  try {
    const [, payload] = token.split('.');

    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '=',
    );
    const jsonPayload = window.atob(padded);

    return JSON.parse(jsonPayload) as T;
  } catch {
    return null;
  }
}

function emitAuthSessionEvent() {
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}
