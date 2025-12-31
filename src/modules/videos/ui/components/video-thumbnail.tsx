import Image from "next/image";

import { THUMBNAIL_FALLBACK } from "@/constants";
import { formatDuration } from "@/lib/utils";

interface VideoThumbnailProps {
  title: string;
  duration: number;
  imageUrl?: string | null;
  previewUrl?: string | null;
}

export const VideoThumbnail = ({
  title,
  duration,
  imageUrl,
  previewUrl,
}: VideoThumbnailProps) => {
  return (
    <div className="group relative">
      {/* Thumbnail Wrapper */}
      <div className="transitions-all relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={imageUrl || THUMBNAIL_FALLBACK}
          alt={title}
          fill
          className="size-full object-cover group-hover:opacity-0"
        />
        <Image
          src={previewUrl || THUMBNAIL_FALLBACK}
          alt={title}
          unoptimized={!!previewUrl}
          fill
          className="size-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>

      {duration > 0 && (
        <div className="absolute right-2 bottom-2 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {formatDuration(duration)}
        </div>
      )}
    </div>
  );
};
