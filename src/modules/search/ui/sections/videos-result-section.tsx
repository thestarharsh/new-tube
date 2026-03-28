"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { ErrorMessage } from "@/components/error-message";

import { DEFAULT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/videos/ui/components/video-row-card";

interface VideosResultSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

const VideosResultSectionSuspense = ({
  query,
  categoryId,
}: VideosResultSectionProps) => {
  const [result, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      query,
      categoryId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {result.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoGridCard key={video.id} data={video} />
          )),
        )}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {result.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoRowCard key={video.id} data={video} />
          )),
        )}
      </div>
      <InfiniteScroll
        hasNextPage={resultQuery.hasNextPage}
        isFetchingNextPage={resultQuery.isFetchingNextPage}
        fetchNextPage={resultQuery.fetchNextPage}
      />
    </>
  );
};

const VideosResultSectionSkeleton = () => {
  return (
    <>
      <div className="hidden flex-col gap-4 md:flex">
        {Array.from({ length: 8 }).map((_, i) => (
          <VideoRowCardSkeleton key={i} />
        ))}
      </div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <VideoGridCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
};

export const VideosResultSection = ({
  query,
  categoryId,
}: VideosResultSectionProps) => {
  return (
    <Suspense
      fallback={<VideosResultSectionSkeleton />}
      key={`${query}-${categoryId}`}
    >
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <ErrorMessage message="Failed to load videos" />
        )}
      >
        <VideosResultSectionSuspense query={query} categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};
