"use client";

import { trpc } from "@/trpc/client";

export const PageClient = () => {
    const [data] = trpc.hello.useSuspenseQuery({ text: "tRPC!" });

    return (
        <div>
            This is a client component with greeting: {data?.greeting}
        </div>
    );
};