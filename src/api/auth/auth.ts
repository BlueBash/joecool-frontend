import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { http } from "@/api/_client";
import type { ApiError } from "@/api/_client";
import { LoginResponseSchema, MessageOnlySchema } from "./types";
import type {
  AuthUser,
  AuthUserRaw,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResult,
  MessageResult,
  ResetPasswordPayload,
} from "./types";

function shapeUser(raw: AuthUserRaw): AuthUser {
  const attrs = raw.attributes;
  return {
    id: raw.id,
    name: attrs.name ?? null,
    username: attrs.username ?? null,
    email: attrs.email ?? null,
    code: attrs.code ?? null,
  };
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResult> {
    const res = await http.post("/auth/login", { user: payload });
    const parsed = LoginResponseSchema.parse(res.data);
    return {
      user: shapeUser(parsed.data),
      token: parsed.meta.token,
      message: parsed.meta.message ?? null,
    };
  },

  async logout(token: string): Promise<MessageResult> {
    const res = await http.post("/auth/logout", { user: { token } });
    const parsed = MessageOnlySchema.parse(res.data);
    return { message: parsed.meta?.message ?? parsed.message ?? null };
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<MessageResult> {
    const res = await http.put("/auth/forgot_password", { user: payload });
    const parsed = MessageOnlySchema.parse(res.data);
    return { message: parsed.message ?? parsed.meta?.message ?? null };
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<MessageResult> {
    const { reset_token, ...rest } = payload;
    const res = await http.put(
      "/auth/reset_password",
      { user: rest },
      reset_token
        ? { headers: { Authorization: `Bearer ${reset_token}` } }
        : undefined,
    );
    const parsed = MessageOnlySchema.parse(res.data);
    const fallback =
      typeof parsed.data === "string" ? (parsed.data as string) : null;
    return { message: parsed.meta?.message ?? parsed.message ?? fallback };
  },
};

export function useLoginMutation(
  opts?: UseMutationOptions<LoginResult, ApiError, LoginPayload>,
) {
  return useMutation<LoginResult, ApiError, LoginPayload>({
    mutationFn: (payload) => authApi.login(payload),
    ...opts,
  });
}

export function useLogoutMutation(
  opts?: UseMutationOptions<MessageResult, ApiError, { token: string }>,
) {
  return useMutation<MessageResult, ApiError, { token: string }>({
    mutationFn: ({ token }) => authApi.logout(token),
    ...opts,
  });
}

export function useForgotPasswordMutation(
  opts?: UseMutationOptions<MessageResult, ApiError, ForgotPasswordPayload>,
) {
  return useMutation<MessageResult, ApiError, ForgotPasswordPayload>({
    mutationFn: (payload) => authApi.forgotPassword(payload),
    ...opts,
  });
}

export function useResetPasswordMutation(
  opts?: UseMutationOptions<MessageResult, ApiError, ResetPasswordPayload>,
) {
  return useMutation<MessageResult, ApiError, ResetPasswordPayload>({
    mutationFn: (payload) => authApi.resetPassword(payload),
    ...opts,
  });
}
