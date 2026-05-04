import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { requireUnauth } from "@/lib/auth-utils";

export default async function ForgotPasswordPage() {
  await requireUnauth();
  return <ForgotPasswordForm />;
}
