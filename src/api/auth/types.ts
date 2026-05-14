import { z } from "zod";

export const AuthUserSchema = z.object({
  id: z.coerce.string(),
  type: z.string().optional(),
  attributes: z.object({
    name: z.string().nullable().optional(),
    username: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  }),
});

export type AuthUserRaw = z.infer<typeof AuthUserSchema>;

export const LoginResponseSchema = z.object({
  data: AuthUserSchema,
  meta: z.object({
    token: z.string(),
    message: z.string().nullable().optional(),
  }),
});

export const MessageOnlySchema = z.object({
  meta: z
    .object({ message: z.string().nullable().optional() })
    .partial()
    .optional(),
  message: z.string().nullable().optional(),
  data: z.unknown().optional(),
});

export interface AuthUser {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  code: string | null;
}

export interface LoginPayload {
  code_or_email: string;
  password: string;
}

export interface LoginResult {
  user: AuthUser;
  token: string;
  message: string | null;
}

export interface ForgotPasswordPayload {
  code_or_email: string;
}

export interface ResetPasswordPayload {
  password: string;
  password_confirmation: string;
  /** Reset token (typically supplied via email link query string). */
  reset_token?: string;
}

export interface MessageResult {
  message: string | null;
}

/**
 * Client-side form schemas used by `react-hook-form` via `zodResolver`.
 * Keep these separate from the wire schemas so we can attach UX-level
 * validation (e.g. ToS checkbox, password confirmation) without leaking
 * those rules into the API payloads.
 */

export const LoginFormSchema = z.object({
  code_or_email: z
    .string()
    .trim()
    .min(1, "Enter your email or code"),
  password: z.string().min(1, "Enter your password"),
  agree: z
    .boolean()
    .refine((v) => v === true, {
      message: "Please accept the Terms of Use & Privacy Policy",
    }),
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;

export const ForgotPasswordFormSchema = z.object({
  code_or_email: z
    .string()
    .trim()
    .min(1, "Enter your email or code"),
});

export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordFormSchema>;

export const ResetPasswordFormSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>;
