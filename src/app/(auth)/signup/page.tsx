import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnauth } from "@/lib/auth-utils";

async function page() {
  await requireUnauth();
  return <RegisterForm />
}

export default page