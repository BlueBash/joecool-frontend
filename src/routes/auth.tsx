import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/login/LoginPage";
import { ForgotPasswordPage } from "@/features/login/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/login/ResetPasswordPage";

export const loginRoute = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Joe Cool" },
      { name: "description", content: "Sign in to your Joe Cool account." },
    ],
  }),
  component: LoginPage,
});

export const forgotPasswordRoute = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — Joe Cool" }] }),
  component: ForgotPasswordPage,
});

export const resetPasswordRoute = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — Joe Cool" }] }),
  component: ResetPasswordPage,
});
