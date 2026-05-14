import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/api";
import {
  ResetPasswordFormSchema,
  type ResetPasswordFormValues,
} from "@/api/auth";
import { paths } from "@/lib/config/paths";
import { FieldError } from "./form-bits";

interface ResetSearch {
  token?: string;
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as ResetSearch;
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: { password: "", password_confirmation: "" },
    mode: "onTouched",
  });

  const reset = useResetPasswordMutation({
    onSuccess: (res) => {
      toast.success(res.message ?? "Password changed successfully");
      navigate({ to: paths.login, replace: true });
    },
    onError: (err) => {
      if (err.fieldErrors) {
        for (const [field, messages] of Object.entries(err.fieldErrors)) {
          const path = field as keyof ResetPasswordFormValues;
          setError(path, { type: "server", message: messages?.[0] ?? err.message });
        }
      }
      toast.error(err.message || "Could not reset password");
    },
  });

  const onSubmit = handleSubmit((values) => {
    reset.mutate({
      password: values.password,
      password_confirmation: values.password_confirmation,
      reset_token: search.token,
    });
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="pt-16 pb-10 text-center">
        <h1 className="font-serif italic text-5xl tracking-tight text-foreground">Joe Cool</h1>
      </div>

      <div className="flex-1 flex items-start justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-sm p-8">
          <div className="text-center space-y-1 mb-6">
            <h2 className="text-2xl font-semibold text-primary">Reset Password</h2>
            <p className="text-sm text-foreground/80">Choose a new password for your account.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-foreground">
                New Password
              </label>
              <div
                className={`flex items-stretch rounded-md border overflow-hidden focus-within:ring-1 focus-within:ring-ring ${
                  errors.password ? "border-destructive" : "border-input"
                }`}
              >
                <span className="grid place-items-center w-10 bg-muted text-muted-foreground border-r border-input">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className="border-0 shadow-none rounded-none focus-visible:ring-0"
                  placeholder="••••••••"
                  disabled={reset.isPending}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="px-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FieldError id="password-error" message={errors.password?.message} />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm" className="text-sm font-semibold text-foreground">
                Confirm Password
              </label>
              <div
                className={`flex items-stretch rounded-md border overflow-hidden focus-within:ring-1 focus-within:ring-ring ${
                  errors.password_confirmation ? "border-destructive" : "border-input"
                }`}
              >
                <span className="grid place-items-center w-10 bg-muted text-muted-foreground border-r border-input">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="confirm"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password_confirmation}
                  aria-describedby={errors.password_confirmation ? "confirm-error" : undefined}
                  className="border-0 shadow-none rounded-none focus-visible:ring-0"
                  placeholder="••••••••"
                  disabled={reset.isPending}
                  {...register("password_confirmation")}
                />
              </div>
              <FieldError id="confirm-error" message={errors.password_confirmation?.message} />
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={reset.isPending}>
              {reset.isPending ? "Saving…" : "Reset password"}
            </Button>

            <div className="text-center text-sm">
              <Link
                to={paths.login}
                className="text-primary underline underline-offset-2 hover:no-underline"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-muted-foreground">
        Copyright © {new Date().getFullYear()} joe cool LLC All rights reserved.
      </footer>
    </div>
  );
}
