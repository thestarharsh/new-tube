"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { ErrorMessage } from "@/components/error-message";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface PlaylistHeaderSectionProps {
  playlistId: string;
}

const PlaylistHeaderSectionSuspense = ({
  playlistId,
}: PlaylistHeaderSectionProps) => {
  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ id: playlistId });

  const router = useRouter();
  const utils = trpc.useUtils();
  const remove = trpc.playlists.remove.useMutation({
    onSuccess: () => {
      toast.success("Playlist removed successfully");
      utils.playlists.getMany.invalidate();
      router.push("/playlists");
    },
    onError: () => {
      toast.error("Failed to remove from playlist");
    },
  });

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        <p className="text-muted-foreground text-xs">Videos in this playlist</p>
      </div>
      <Button
        size={"icon"}
        variant={"outline"}
        className="rounded-full"
        onClick={() => remove.mutate({ id: playlistId })}
        disabled={remove.isPending}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
};

const PlaylistHeaderSectionSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-3 w-36" />
      </div>
      <Skeleton className="size-9 rounded-full" />
    </div>
  );
};

export const PlaylistHeaderSection = ({
  playlistId,
}: PlaylistHeaderSectionProps) => {
  return (
    <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
      <ErrorBoundary
        fallbackRender={({ error }) => <ErrorMessage message={"Error..."} />}
      >
        <PlaylistHeaderSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};
