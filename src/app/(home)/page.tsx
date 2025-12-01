import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient, trpc } from "@/trpc/server";

import { PageClient } from "./client";

export default function Home() {
   trpc.hello.prefetch({ text: "tRPC!" });

  return (
    <div>
      <HydrateClient>
        <Suspense fallback={<p>Loading...</p>}>
          <ErrorBoundary fallback={<p>Error!</p>}>
            <PageClient />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </div>
  );
}
