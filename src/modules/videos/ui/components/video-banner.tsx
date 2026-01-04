import { AlertTriangleIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import { VideoGetOneOutput } from "../../types";

interface VideoBannerProps {
  status: VideoGetOneOutput["muxStatus"];
}

export const VideoBannerSkeleton = () => {
  return (
    <div className="bg-muted flex items-center gap-2 rounded-b-xl px-4 py-3">
      <Skeleton className="size-12 rounded" />
      <Skeleton className="h-4 w-48" />
    </div>
  );
};

export const VideoBanner = ({ status }: VideoBannerProps) => {
  if (status !== "ready") {
    return (
      <div className="flex items-center gap-2 rounded-b-xl bg-yellow-400 px-4 py-3">
        <AlertTriangleIcon className="size-12 text-white" />
        <p className="line-clamp-1 text-xs font-medium text-black md:text-sm">
          This video is still processing
        </p>
      </div>
    );
  }
  return null;
};
