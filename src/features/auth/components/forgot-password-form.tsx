"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { cn } from "@/lib/utils";

const emailSchema = z.object({
  email: z.email("Please enter a valid email address"),
});
type EmailValues = z.infer<typeof emailSchema>;

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d+$/, "Code must be numeric"),
});
type OtpValues = z.infer<typeof otpSchema>;

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type PasswordValues = z.infer<typeof passwordSchema>;

type Step = "email" | "otp" | "password";
const STEPS: Step[] = ["email", "otp", "password"];

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const onEmailSubmit = async (values: EmailValues) => {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: values.email }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Something went wrong.");
      return;
    }
    setEmail(values.email);
    setStep("otp");
    toast.success("Check your email for the reset code.");
  };

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onOtpSubmit = async (values: OtpValues) => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: values.otp }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Invalid code.");
      return;
    }
    setOtp(values.otp);
    setStep("password");
  };

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onPasswordSubmit = async (values: PasswordValues) => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, password: values.password }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Reset failed.");
      return;
    }
    toast.success("Password reset! Please log in.");
    router.replace("/login");
  };

  const stepIndex = STEPS.indexOf(step);
  const stepMeta = {
    email: {
      title: "Forgot Password",
      description: "Enter your email to receive a reset code",
    },
    otp: {
      title: "Enter Code",
      description: `We sent a 6-digit code to ${email}`,
    },
    password: {
      title: "New Password",
      description: "Choose a strong password",
    },
  } as const;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-center gap-2" aria-hidden>
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300 motion-reduce:transition-none",
                step === s
                  ? "bg-primary scale-125"
                  : i < stepIndex
                    ? "bg-primary/40"
                    : "bg-muted-foreground/20",
              )}
            />
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-8 transition-all duration-500 motion-reduce:transition-none",
                  i < stepIndex ? "bg-primary/40" : "bg-muted-foreground/20",
                )}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle>{stepMeta[step].title}</CardTitle>
          <CardDescription>{stepMeta[step].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                <div className="grid gap-6">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            autoFocus
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
                    disabled={emailForm.formState.isSubmitting}
                  >
                    {emailForm.formState.isSubmitting
                      ? "Sending..."
                      : "Send Code"}
                  </Button>
                  <div className="text-center text-sm">
                    Remember it?{" "}
                    <Link
                      href="/login"
                      className="underline underline-offset-4 text-primary hover:text-primary/80 transition-colors"
                    >
                      Back to login
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          )}

          {step === "otp" && (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)}>
                <div className="grid gap-6">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reset Code</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="123456"
                            className="text-center text-2xl tracking-[0.4em] font-mono"
                            autoFocus
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
                    disabled={otpForm.formState.isSubmitting}
                  >
                    {otpForm.formState.isSubmitting
                      ? "Verifying..."
                      : "Verify Code"}
                  </Button>
                  <div className="text-center text-sm">
                    <button
                      type="button"
                      onClick={() => setStep("email")}
                      className="underline underline-offset-4 text-primary hover:text-primary/80 transition-colors"
                    >
                      Use a different email
                    </button>
                  </div>
                </div>
              </form>
            </Form>
          )}

          {step === "password" && (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <div className="grid gap-6">
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="**********"
                            autoFocus
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
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
                    disabled={passwordForm.formState.isSubmitting}
                  >
                    {passwordForm.formState.isSubmitting
                      ? "Resetting..."
                      : "Reset Password"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
