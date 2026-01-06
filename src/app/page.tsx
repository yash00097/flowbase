"use client";

import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { Button } from "@/components/ui/button";
import LogoutButton from './LogoutButton'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";


function Page() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const {data} = useQuery(trpc.getWorkflows.queryOptions());
  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      toast.success("Workflow queued!");
    }
  }));

  return (
    <div className='text-red-400 flex items-center justify-center'>
      {JSON.stringify(data)} 
      <Button disabled={create.isPending} onClick={() => create.mutate()}>Create Workflow</Button>
      <LogoutButton />
    </div>
  )
}

export default Page;