import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/api";
import {
  ForgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from "@/api/auth";
import { paths } from "@/lib/config/paths";
import { FieldError } from "./form-bits";

export function ForgotPasswordPage() {
  const [submittedFor, setSubmittedFor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: { code_or_email: "" },
    mode: "onTouched",
  });

  const forgot = useForgotPasswordMutation({
    onSuccess: (res, vars) => {
      setSubmittedFor(vars.code_or_email);
      toast.success(res.message ?? "Forgot password email sent");
    },
    onError: (err) => {
      if (err.fieldErrors) {
        for (const [field, messages] of Object.entries(err.fieldErrors)) {
          const path = field as keyof ForgotPasswordFormValues;
          setError(path, { type: "server", message: messages?.[0] ?? err.message });
        }
      }
      toast.error(err.message || "Could not send reset email");
    },
  });

  const onSubmit = handleSubmit((values) => {
    forgot.mutate({ code_or_email: values.code_or_email.trim() });
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="pt-16 pb-10 text-center">
        <h1 className="font-serif italic text-5xl tracking-tight text-foreground">Joe Cool</h1>
      </div>

      <div className="flex-1 flex items-start justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-sm p-8">
          <div className="text-center space-y-1 mb-6">
            <h2 className="text-2xl font-semibold text-primary">Forgot Password</h2>
            <p className="text-sm text-foreground/80">
              Enter your email or code and we'll send you instructions to reset your password.
            </p>
          </div>

          {submittedFor ? (
            <div className="space-y-5 text-center">
              <p className="text-sm text-foreground">
                If an account exists for <span className="font-medium">{submittedFor}</span>, a reset
                link has been sent. Please check your inbox.
              </p>
              <Button asChild className="w-full h-11">
                <Link to={paths.login}>Back to sign in</Link>
              </Button>
            </div>
          ) : (
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
                    disabled={forgot.isPending}
                    {...register("code_or_email")}
                  />
                </div>
                <FieldError id="identifier-error" message={errors.code_or_email?.message} />
              </div>

              <Button type="submit" className="w-full h-11 text-base" disabled={forgot.isPending}>
                {forgot.isPending ? "Sending…" : "Send reset link"}
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
          )}
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-muted-foreground">
        Copyright © {new Date().getFullYear()} joe cool LLC All rights reserved.
      </footer>
    </div>
  );
}
