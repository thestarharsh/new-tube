"use client";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

interface SuggestionSectionProps {
  videoId: string;
}

export const SuggestionSection = ({ videoId }: SuggestionSectionProps) => {
  const [suggestions] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <div className="mt-4 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{JSON.stringify(suggestions)}</h2>
      <div className="grid grid-cols-2 gap-4"></div>
    </div>
  );
};
