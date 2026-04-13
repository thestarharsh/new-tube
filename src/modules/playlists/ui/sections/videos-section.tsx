"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { ErrorMessage } from "@/components/error-message";
import { InfiniteScroll } from "@/components/infinite-scroll";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/videos/ui/components/video-row-card";

interface VideosSectionProps {
  playlistId: string;
}

const VideosSectionSuspense = ({ playlistId }: VideosSectionProps) => {
  const [videos, query] = trpc.playlists.getVideos.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      playlistId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const utils = trpc.useUtils();
  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video removed from playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId: data.videoId });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
      utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
    },
    onError: () => {
      toast.error("Failed to remove video from playlist");
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoGridCard
              key={video.id}
              data={video}
              onRemove={() =>
                removeVideo.mutate({ playlistId, videoId: video.id })
              }
            />
          )),
        )}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {videos.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoRowCard
              key={video.id}
              data={video}
              size={"compact"}
              onRemove={() =>
                removeVideo.mutate({ playlistId, videoId: video.id })
              }
            />
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

const VideosSectionSkeleton = ({ playlistId }: VideosSectionProps) => (
  <div>
    <div className="flex flex-col gap-4 gap-y-10 md:hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <VideoGridCardSkeleton key={i} />
      ))}
    </div>
    <div className="hidden flex-col gap-4 md:flex">
      {Array.from({ length: 8 }).map((_, i) => (
        <VideoRowCardSkeleton key={i} size={"compact"} />
      ))}
    </div>
  </div>
);

export const VideosSection = ({ playlistId }: VideosSectionProps) => {
  return (
    <Suspense fallback={<VideosSectionSkeleton playlistId={playlistId} />}>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <ErrorMessage message={"Failed to load videos"} />
        )}
      >
        <VideosSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};
