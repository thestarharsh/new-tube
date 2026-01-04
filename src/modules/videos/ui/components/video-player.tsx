import MuxPlayer from "@mux/mux-player-react";

import { THUMBNAIL_FALLBACK } from "@/constants";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoPlayerProps {
  playbackId: string | null | undefined;
  thumbnailUrl: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
}

export const VideoPlayerSkeleton = () => {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl rounded-b-none bg-black">
      <Skeleton className="h-full w-full" />
    </div>
  );
};

export const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  autoPlay,
  onPlay,
}: VideoPlayerProps) => {
  return (
    <MuxPlayer
      playbackId={playbackId || ""}
      poster={thumbnailUrl || THUMBNAIL_FALLBACK}
      playerInitTime={0}
      autoPlay={autoPlay}
      thumbnailTime={0}
      onPlay={onPlay}
      className="h-full w-full object-contain"
      accentColor="#ff2056"
    />
  );
};
