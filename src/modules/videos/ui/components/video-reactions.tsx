import { useClerk } from "@clerk/nextjs";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { VideoGetOneOutput } from "../../types";

interface VideoReactionsProps {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOneOutput["viewerReaction"];
}

export const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  viewerReaction,
}: VideoReactionsProps) => {
  const clerk = useClerk();

  const utils = trpc.useUtils();

  const like = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId });
      //TODO: Invalidate Liked Playlists
    },
    onError: (error) => {
      if (error?.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        toast.error("Please sign in to like the video");
        return;
      }
      toast.error("Something went wrong");
    },
  });
  const dislike = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ videoId });
      //TODO: Invalidate Disliked Playlists
    },
    onError: (error) => {
      if (error?.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        toast.error("Please sign in to dislike the video");
        return;
      }
      toast.error("Something went wrong");
    },
  });

  return (
    <div className="flex flex-none items-center">
      <Button
        onClick={() => like.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        className="gap-2 rounded-l-full rounded-r-none pr-4"
        variant={"secondary"}
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Separator className="h-6" orientation="vertical" />
      <Button
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        className="rounded-l-none rounded-r-full pl-3"
        variant={"secondary"}
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction === "dislike" && "fill-black")}
        />
        {dislikes}
      </Button>
    </div>
  );
};
