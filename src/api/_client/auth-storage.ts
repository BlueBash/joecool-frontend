import { UserInfo } from "./types";

const ACCESS_KEY = "access_token";
const LEGACY_KEY = "Access-Token";
const USER_INFO_KEY = "User-Info";

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
  registerRefresh(fn: RefreshFn): void {
    refreshImpl = fn;
  },
  refresh(): Promise<string | null> {
    return refreshImpl();
  },
};
