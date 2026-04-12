import { toast } from "sonner";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { InfiniteScroll } from "@/components/infinite-scroll";

interface PlaylistAddModalProps {
  videoId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const PlaylistAddModal = ({
  videoId,
  isOpen,
  onOpenChange,
}: PlaylistAddModalProps) => {
  const utils = trpc.useUtils();
  const {
    data: playlists,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = trpc.playlists.getManyForVideo.useInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!videoId && isOpen,
    },
  );

  const handleOpenChange = (newOpen: boolean) => {
    utils.playlists.getManyForVideo.reset();
    onOpenChange(newOpen);
  };

  const addVideo = trpc.playlists.addVideo.useMutation({
    onSuccess: () => {
      toast.success("Video added to playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
      // TODO: Add getOne invalidate as well
    },
    onError: () => {
      toast.error("Failed to add video to playlist");
    },
  });

  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: () => {
      toast.success("Video removed from playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
      // TODO: Add getOne invalidate as well
    },
    onError: () => {
      toast.error("Failed to remove video from playlist");
    },
  });

  return (
    <ResponsiveModal
      title="Add to Playlist"
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
    >
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2Icon className="text-muted-foreground size-5 animate-spin" />
          </div>
        )}
        {!isLoading &&
          playlists?.pages
            ?.flatMap((page) => page.items)
            .map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                className="w-full justify-start px-2 [&_svg]:size-5"
                size="lg"
                onClick={() => {
                  if (playlist?.containsVideo) {
                    removeVideo.mutateAsync({
                      playlistId: playlist.id,
                      videoId,
                    });
                  } else {
                    addVideo.mutateAsync({ playlistId: playlist.id, videoId });
                  }
                }}
                disabled={addVideo.isPending || removeVideo.isPending}
              >
                {playlist?.containsVideo ? (
                  <SquareCheckIcon className="text-success-foreground mr-2" />
                ) : (
                  <SquareIcon className="text-muted-foreground mr-2" />
                )}
                {playlist.name}
              </Button>
            ))}
        {!isLoading && (
          <InfiniteScroll
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isManual
          />
        )}
      </div>
    </ResponsiveModal>
  );
};
