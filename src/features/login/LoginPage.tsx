import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { authStorage, useLoginMutation } from "@/api";
import { LoginFormSchema, type LoginFormValues } from "@/api/auth";
import { useAuth } from "@/store";
import { paths, HOME_REDIRECT } from "@/lib/config/paths";
import { FieldError } from "./form-bits";

interface LoginSearch {
  redirect?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as LoginSearch;
  const setUser = useAuth((s) => s.setUser);
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { code_or_email: "", password: "", agree: true },
    mode: "onTouched",
  });

  const login = useLoginMutation({
    onSuccess: (response) => {
      authStorage.setAccessToken(response.token);
      setUser({
        id: response.user.id,
        name: response.user.name ?? "",
        code: response.user.code ?? "",
        username: response.user.username ?? "",
        email: response.user.email ?? "",
      });
      const target =
        search.redirect && search.redirect.startsWith("/") ? search.redirect : HOME_REDIRECT;
      const displayName = response.user.name ?? response.user.username ?? response.user.email ?? "";
      toast.success(displayName ? `Welcome back, ${displayName}` : "Signed in");
      navigate({ to: target, replace: true });
    },
    onError: (err) => {
      if (err.fieldErrors) {
        for (const [field, messages] of Object.entries(err.fieldErrors)) {
          const path = field as keyof LoginFormValues;
          setError(path, { type: "server", message: messages?.[0] ?? err.message });
        }
      }
      toast.error(err.message || "Sign in failed");
    },
  });

  const onSubmit = handleSubmit(
    (values) => {
      login.mutate({
        code_or_email: values.code_or_email.trim(),
        password: values.password,
      });
    },
    (formErrors) => {
      if (import.meta.env.DEV) {
        console.warn("[LoginPage] submit blocked by validation", formErrors);
      }
      const firstMessage = Object.values(formErrors)
        .map((e) => (e && typeof e === "object" ? (e as { message?: unknown }).message : undefined))
        .find((m): m is string => typeof m === "string" && m.length > 0);
      toast.error(firstMessage ?? "Please fix the highlighted fields");
    },
  );

  const loading = login.isPending;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="pt-16 pb-10 text-center">
        <h1 className="font-serif italic text-5xl tracking-tight text-foreground">Joe Cool</h1>
      </div>
      <div className="flex-1 flex items-start justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-sm p-8">
          <div className="text-center space-y-1 mb-6">
            <h2 className="text-2xl font-semibold text-primary">Welcome !</h2>
            <p className="text-sm text-foreground/80">Sign In to your account</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="identifier" className="text-sm font-semibold text-foreground">
                Email or Code
              </label>
              <div
                className={`flex items-stretch rounded-md border overflow-hidden focus-within:ring-1 focus-within:ring-ring ${
                  errors.code_or_email ? "border-destructive" : "border-input"
                }`}
              >
                <span className="grid place-items-center w-10 bg-muted text-muted-foreground border-r border-input">
                  <User className="h-4 w-4" />
                </span>
                <Input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  aria-invalid={!!errors.code_or_email}
                  aria-describedby={errors.code_or_email ? "identifier-error" : undefined}
                  className="border-0 shadow-none rounded-none focus-visible:ring-0"
                  placeholder="you@company.com"
                  disabled={loading}
                  {...register("code_or_email")}
                />
              </div>
              <FieldError id="identifier-error" message={errors.code_or_email?.message} />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-foreground">
                Password
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
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className="border-0 shadow-none rounded-none focus-visible:ring-0"
                  placeholder="••••••••"
                  disabled={loading}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="px-3 text-muted-foreground hover:text-foreground"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FieldError id="password-error" message={errors.password?.message} />
              <div className="flex justify-end pt-1">
                <Link
                  to={paths.forgotPassword}
                  className="text-sm font-medium text-primary underline underline-offset-2 hover:no-underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-start gap-2 text-sm text-foreground/80 select-none">
                <Controller
                  control={control}
                  name="agree"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(v) => field.onChange(Boolean(v))}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      aria-invalid={!!errors.agree}
                      aria-describedby={errors.agree ? "agree-error" : undefined}
                      className="mt-0.5"
                    />
                  )}
                />
                <span>
                  By continuing, you agree to Joe Cool{" "}
                  <a href="#" className="text-primary underline">
                    Terms of Use
                  </a>{" "}
                  &{" "}
                  <a href="#" className="text-primary underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              <FieldError id="agree-error" message={errors.agree?.message} />
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-muted-foreground">
        Copyright © {new Date().getFullYear()} joe cool LLC All rights reserved.
      </footer>
    </div>
  );
}
