"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { ErrorMessage } from "@/components/error-message";

import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "../components/video-row-card";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "../components/video-grid-card";

interface SuggestionSectionProps {
  videoId: string;
  isManual?: boolean;
}

const SuggestionSectionSuspense = ({
  videoId,
  isManual,
}: SuggestionSectionProps) => {
  const [suggestions, query] =
    trpc.suggestions.getMany.useSuspenseInfiniteQuery(
      {
        videoId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  return (
    <>
      <div className="hidden space-y-3 md:block">
        {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoRowCard key={video.id} data={video} size="compact" />
          )),
        )}
      </div>
      <div className="block space-y-10 md:hidden">
        {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoGridCard key={video.id} data={video} />
          )),
        )}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
        isManual={isManual}
      />
    </>
  );
};

const SuggestionSectionSkeleton = () => {
  return (
    <>
      <div className="hidden space-y-3 md:block">
        {Array.from({ length: 8 }).map((_, i) => (
          <VideoRowCardSkeleton key={i} />
        ))}
      </div>
      <div className="block space-y-10 md:hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <VideoGridCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
};

export const SuggestionSection = ({
  videoId,
  isManual,
}: SuggestionSectionProps) => {
  return (
    <Suspense fallback={<SuggestionSectionSkeleton />}>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <ErrorMessage message="Failed to load suggestions" />
        )}
      >
        <SuggestionSectionSuspense videoId={videoId} isManual={isManual} />
      </ErrorBoundary>
    </Suspense>
  );
};
