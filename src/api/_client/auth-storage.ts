/**
 * Token storage seam. The rest of the app should never touch
 * `localStorage` directly for auth — swap this module to move to
 * httpOnly cookies, native keychain, etc.
 */

const ACCESS_KEY = "joecool.access_token";
const LEGACY_KEY = "Access-Token";

type RefreshFn = () => Promise<string | null>;

let refreshImpl: RefreshFn = async () => null;

function readAccess(): string | null {
  return localStorage.getItem(ACCESS_KEY) ?? localStorage.getItem(LEGACY_KEY);
}

export const authStorage = {
  getAccessToken(): string | null {
    return readAccess();
  },
  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_KEY, token);
  },
  clear(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(LEGACY_KEY);
  },
  /**
   * Register the refresh implementation from the auth module. Kept
   * indirect so `_client` has no dependency on `api/auth`.
   */
  registerRefresh(fn: RefreshFn): void {
    refreshImpl = fn;
  },
  refresh(): Promise<string | null> {
    return refreshImpl();
  },
};
