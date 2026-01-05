import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { Button } from "@/components/ui/button";
import LogoutButton from './LogoutButton'


async function Page() {
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className='text-red-400 flex items-center justify-center'>
      {JSON.stringify(data)} 
      <LogoutButton />
    </div>
  )
}

export default Page;