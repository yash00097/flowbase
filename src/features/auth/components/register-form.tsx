"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    email: z.email("please enter a valid email address"),
    password: z.string().min(8, "password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const otpSchema = z.object({
  otp: z.string().length(6, "Enter the 6-digit code"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

const RESEND_COOLDOWN_SECONDS = 120;

export function RegisterForm() {
  const router = useRouter();
  const postAuthRedirect = "/workflows";

  const [step, setStep] = useState<"form" | "otp">("form");
  const [creds, setCreds] = useState<RegisterFormValues | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const autoSentRef = useRef(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const sendOtp = useCallback(
    async (email: string, silent = false) => {
      const res = await fetch("/api/auth/signup-otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        retryAfter?: number;
      };
      if (!res.ok) {
        if (res.status === 429 && data.retryAfter) {
          setCooldown(data.retryAfter);
          if (!silent) {
            toast.error("Please wait before requesting another code.");
          }
          return false;
        }
        toast.error(data.error ?? "Failed to send code.");
        return false;
      }
      setCooldown(RESEND_COOLDOWN_SECONDS);
      if (!silent) toast.success("Code sent. Check your inbox.");
      return true;
    },
    [],
  );

  const signInGithub = async () => {
    await authClient.signIn.social(
      { provider: "github", callbackURL: postAuthRedirect },
      {
        onSuccess: () => {
          router.replace(postAuthRedirect);
          router.refresh();
        },
        onError: () => {
          toast.error("Failed to login with Github");
        },
      },
    );
  };

  const signInGoogle = async () => {
    await authClient.signIn.social(
      { provider: "google", callbackURL: postAuthRedirect },
      {
        onSuccess: () => {
          router.replace(postAuthRedirect);
          router.refresh();
        },
        onError: () => {
          toast.error("Failed to login with Google");
        },
      },
    );
  };

  const onFormSubmit = async (values: RegisterFormValues) => {
    const ok = await sendOtp(values.email, true);
    if (!ok) return;
    setCreds(values);
    autoSentRef.current = true;
    setStep("otp");
    toast.success("Code sent. Check your inbox.");
  };

  const onOtpSubmit = async (values: OtpFormValues) => {
    if (!creds) return;
    const verifyRes = await fetch("/api/auth/signup-otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: creds.email, otp: values.otp }),
    });
    const verifyData = (await verifyRes.json().catch(() => ({}))) as {
      error?: string;
    };
    if (!verifyRes.ok) {
      toast.error(verifyData.error ?? "Invalid or expired code.");
      return;
    }

    await authClient.signUp.email(
      {
        name: creds.email.split("@")[0],
        email: creds.email,
        password: creds.password,
        callbackURL: postAuthRedirect,
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully!");
          router.replace(postAuthRedirect);
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
  };

  const onResend = async () => {
    if (!creds || cooldown > 0) return;
    await sendOtp(creds.email);
  };

  const isFormPending = form.formState.isSubmitting;
  const isOtpPending = otpForm.formState.isSubmitting;
  const isPending = isFormPending || isOtpPending;

  const formatCooldown = (s: number) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>
            {step === "form" ? "Get Started" : "Verify your email"}
          </CardTitle>
          <CardDescription>
            {step === "form"
              ? "Create a new account"
              : `We sent a 6-digit code to ${creds?.email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "form" ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onFormSubmit)}>
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={signInGithub}
                      type="button"
                      disabled={isPending}
                    >
                      <Image
                        src="/logos/github.svg"
                        width={20}
                        height={20}
                        alt="Github"
                      />
                      Continue with Github
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={signInGoogle}
                      type="button"
                      disabled={isPending}
                    >
                      <Image
                        src="/logos/google.svg"
                        width={20}
                        height={20}
                        alt="Google"
                      />
                      Continue with Google
                    </Button>
                  </div>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="m@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="**********"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="**********"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isFormPending ? "Sending code..." : "Continue"}
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className={cn(
                        "underline underline-offset-4 text-primary hover:text-primary/80 transition-colors",
                        isPending && "pointer-events-none opacity-50",
                      )}
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)}>
                <div className="grid gap-6">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification code</FormLabel>
                        <FormControl>
                          <Input
                            inputMode="numeric"
                            maxLength={6}
                            autoComplete="one-time-code"
                            placeholder="••••••"
                            className="text-center text-lg font-mono tracking-[0.4em]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onResend}
                      disabled={cooldown > 0 || isPending}
                    >
                      {cooldown > 0 ? "Resend code" : "Resend code"}
                    </Button>
                    {cooldown > 0 ? (
                      <span className="text-sm text-muted-foreground tabular-nums">
                        Resend in {formatCooldown(cooldown)}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Didn&apos;t get it?
                      </span>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isOtpPending ? "Verifying..." : "Verify & create account"}
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("form");
                      otpForm.reset();
                      autoSentRef.current = false;
                    }}
                    className={cn(
                      "text-center text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4",
                      isPending && "pointer-events-none opacity-50",
                    )}
                    disabled={isPending}
                  >
                    Use a different email
                  </button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
