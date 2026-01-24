import { useAuth, useClerk } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  MessageSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { CommentGetManyOutput } from "../../types";

interface CommentItemProps {
  comment: CommentGetManyOutput["items"][number];
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const clerk = useClerk();
  const { userId } = useAuth();
  const utils = trpc.useUtils();

  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast.success("Comment deleted successfully");
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Please login to delete this comment");
        clerk.openSignIn();
        return;
      }
      toast.error("Failed to delete comment");
    },
  });

  const like = trpc.commentReactions.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Please login to like this comment");
        clerk.openSignIn();
        return;
      }
      toast.error("Failed to like comment");
    },
  });
  const dislike = trpc.commentReactions.dislike.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Please login to dislike this comment");
        clerk.openSignIn();
        return;
      }
      toast.error("Failed to dislike comment");
    },
  });

  const isShowDeleteButton = comment.user.clerkId === userId;

  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}`}>
          <UserAvatar
            size={"lg"}
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/users/${comment.userId}`}>
            <div className="mb-0.5 flex items-center gap-2">
              <span className="pb-0.5 text-sm font-medium">
                {comment.user.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {formatDistanceToNow(comment.updatedAt, { addSuffix: true })}
              </span>
            </div>
          </Link>
          <p className="text-accent-foreground text-sm">{comment.comment}</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center">
              <Button
                disabled={like.isPending}
                onClick={() => like.mutate({ commentId: comment.id })}
                className="size-8"
                size={"icon"}
                variant={"ghost"}
              >
                <ThumbsUpIcon
                  className={cn(
                    comment.viewerReaction === "like" && "fill-black",
                  )}
                />
              </Button>
              <span className="text-xs font-medium">{comment.likeCount}</span>
              <Button
                disabled={dislike.isPending}
                onClick={() => dislike.mutate({ commentId: comment.id })}
                className="size-8"
                size={"icon"}
                variant={"ghost"}
              >
                <ThumbsDownIcon
                  className={cn(
                    comment.viewerReaction === "dislike" && "fill-black",
                  )}
                />
              </Button>
              <span className="text-xs font-medium">
                {comment.dislikeCount}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"} className="size-8">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>
              <MessageSquareIcon className="size-4" />
              Reply
            </DropdownMenuItem>
            {isShowDeleteButton && (
              <DropdownMenuItem
                onClick={() => remove.mutate({ commentId: comment.id })}
              >
                <Trash2Icon className="size-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
