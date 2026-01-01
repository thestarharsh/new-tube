"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/error-message";
import { trpc } from "@/trpc/client";
import { cn } from "@/lib/utils";

import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import { VideoBanner } from "@/modules/videos/ui/components/video-banner";
import { VideoTopRow } from "@/modules/videos/ui/components/video-top-row";

interface VideoSectionProps {
  videoId: string;
}

const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
  const [video] = trpc.videos.getOne.useSuspenseQuery({ videoId });

  return (
    <>
      <div
        className={cn(
          "relative aspect-video overflow-hidden rounded-xl bg-black",
          video.muxStatus !== "ready" && "rounded-b-none",
        )}
      >
        <VideoPlayer
          autoPlay
          onPlay={() => {}}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
};

const VideosSectionSkeleton = () => {
  return (
    <div>
      <Skeleton />
    </div>
  );
};

export const VideoSection = ({ videoId }: VideoSectionProps) => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <ErrorMessage message={error.message || "Failed to load video"} />
        )}
      >
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};
