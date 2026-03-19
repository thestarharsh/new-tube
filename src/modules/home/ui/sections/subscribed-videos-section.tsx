"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { ErrorMessage } from "@/components/error-message";
import { InfiniteScroll } from "@/components/infinite-scroll";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";

interface SubscribedVideosSectionProps {}

const SubscribedVideosSectionSuspense = ({}: SubscribedVideosSectionProps) => {
  const [videos, query] = trpc.videos.getSubscribed.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {videos.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoGridCard key={video.id} data={video} />
          )),
        )}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};

const SubscribedVideosSectionSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <VideoGridCardSkeleton key={i} />
    ))}
  </div>
);

export const SubscribedVideosSection = ({}: SubscribedVideosSectionProps) => {
  return (
    <Suspense fallback={<SubscribedVideosSectionSkeleton />}>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <ErrorMessage message={"Failed to load videos"} />
        )}
      >
        <SubscribedVideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};
