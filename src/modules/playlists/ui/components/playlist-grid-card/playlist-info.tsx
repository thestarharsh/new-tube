import { Skeleton } from "@/components/ui/skeleton";
import { PlaylistGetManyOutput } from "@/modules/playlists/types";

interface PlaylistInfoProps {
  data: PlaylistGetManyOutput["items"][number];
}

export const PlaylistInfoSkeleton = () => {
  return (
    <div className="flex gap-3">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
};

export const PlaylistInfo = ({ data }: PlaylistInfoProps) => {
  return (
    <div className="flex gap-3">
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-sm font-medium wrap-break-word lg:line-clamp-2">
          {data.name}
        </h3>
        <p className="text-muted-foreground text-sm">Playlist</p>
        <p className="text-muted-foreground hover:text-primary text-sm font-semibold">
          View Full Playlist
        </p>
      </div>
    </div>
  );
};
