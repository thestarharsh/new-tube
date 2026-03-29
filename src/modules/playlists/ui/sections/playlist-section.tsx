"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { ErrorMessage } from "@/components/error-message";
import { InfiniteScroll } from "@/components/infinite-scroll";

import {
  PlaylistGridCard,
  PlaylistGridCardSkeleton,
} from "../components/playlist-grid-card";

interface PlaylistSectionProps {}

const PlaylistSectionSuspense = ({}: PlaylistSectionProps) => {
  const [playlists, query] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
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
        {playlists?.pages
          ?.flatMap((page) => page.items)
          .map((item) => (
            <PlaylistGridCard key={item.id} data={item} />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};

const PlaylistSectionSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <PlaylistGridCardSkeleton key={i} />
    ))}
  </div>
);

export const PlaylistSection = ({}: PlaylistSectionProps) => {
  return (
    <Suspense fallback={<PlaylistSectionSkeleton />}>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <ErrorMessage message={"Failed to load videos"} />
        )}
      >
        <PlaylistSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};
