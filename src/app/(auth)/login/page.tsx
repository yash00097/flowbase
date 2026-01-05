import { LoginForm } from '@/features/auth/components/login-form'
import { requireUnauth } from '@/lib/auth-utils'

async function page() {
  await requireUnauth();
  return <LoginForm />
  
}

export default page