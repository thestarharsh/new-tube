import { useMemo } from "react";
import Image from "next/image";
import { ListVideoIcon, PlayIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { THUMBNAIL_FALLBACK } from "@/constants";
import { Skeleton } from "@/components/ui/skeleton";

interface PlaylistThumbnailProps {
  imageUrl?: string | null;
  title: string;
  count: number;
  className?: string;
}

export const PlaylistThumbnailSkeleton = () => {
  return (
    <div className="relative pt-3">
      <div className="relative">
        <div className="absolute -top-3 left-1/2 aspect-video w-[97%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/20" />
        <div className="absolute -top-1.5 left-1/2 aspect-video w-[98.5%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/25" />
        <div className="absolute left-1/2 aspect-video w-[99%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/30" />
        <Skeleton className="aspect-video w-full rounded-xl" />
      </div>
    </div>
  );
};

export const PlaylistThumbnail = ({
  imageUrl,
  title,
  count,
  className,
}: PlaylistThumbnailProps) => {
  const compactCount = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(count);
  }, [count]);

  return (
    <div className={cn("relative pt-3", className)}>
      <div className="group relative">
        <div className="absolute -top-3 left-1/2 aspect-video w-[97%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/20" />
        <div className="absolute -top-1.5 left-1/2 aspect-video w-[98.5%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/25" />
        <div className="absolute left-1/2 aspect-video w-[99%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/30" />

        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={imageUrl || THUMBNAIL_FALLBACK}
            alt={title}
            className="h-full w-full object-cover"
            fill
            priority={true}
          />
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/70 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center gap-x-2">
            <PlayIcon className="size-4 fill-white text-white" />
            <span className="font-medium text-white">Play All</span>
          </div>
        </div>
      </div>

      <div className="absolute right-2 bottom-2 flex items-center gap-x-1 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
        <ListVideoIcon className="size-4" />
        <span>{compactCount} Videos</span>
      </div>
    </div>
  );
};
