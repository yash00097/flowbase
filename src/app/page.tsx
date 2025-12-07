import { getQueryClient,trpc } from "@/trpc/server";
import Client from "./Client";
import { dehydrate,HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());
  return (
    <div className='text-red-400 flex items-center justify-center'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading...</div>}>
          <Client />
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}

export default Home