import { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/user-avatar";
import { UserInfo } from "@/modules/users/ui/components/user-info";

import { VideoMenu } from "./video-menu";
import { VideoThumbnail } from "./video-thumbnail";
import { VideoGetManyOutput } from "../../types";

const videoRowCardVariants = cva("group flex min-w-0", {
  variants: {
    size: {
      default: "gap-4",
      compact: "gap-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const thumbnailVariants = cva("relative flex-none", {
  variants: {
    size: {
      default: "w-[38%]",
      compact: "w-[168px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface VideoRowCardProps extends VariantProps<typeof videoRowCardVariants> {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

interface VideoRowCardSkeletonProps extends VariantProps<
  typeof videoRowCardVariants
> {}

export const VideoRowCardSkeleton = ({
  size = "default",
}: VideoRowCardSkeletonProps) => {
  return (
    <div className={cn(videoRowCardVariants({ size }))}>
      <div className={cn(thumbnailVariants({ size }))}>
        <Skeleton className="aspect-video w-full rounded-xl" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-x-2">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton
              className={cn(
                "h-4 w-full",
                size === "compact" ? "text-sm" : "text-base",
              )}
            />
            {size === "default" && (
              <>
                <Skeleton className="h-3 w-24" />
                <div className="my-3 flex items-center gap-2">
                  <Skeleton className="size-6 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-3 w-full" />
              </>
            )}
            {size === "compact" && (
              <>
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </>
            )}
          </div>
          <div className="flex-none">
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const VideoRowCard = ({
  data,
  size = "default",
  onRemove,
}: VideoRowCardProps) => {
  const compactViewCount = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(data.viewCount);
  }, [data.viewCount]);

  const compactLikeCount = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(data.likeCount);
  }, [data.likeCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNowStrict(data.createdAt, {
      addSuffix: true,
    });
  }, [data.createdAt]);

  return (
    <div className={cn(videoRowCardVariants({ size }))}>
      <Link
        prefetch
        href={`/videos/${data.id}`}
        className={cn(thumbnailVariants({ size }))}
      >
        <VideoThumbnail
          title={data.title}
          duration={data.duration}
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-x-2">
          <Link prefetch href={`/videos/${data.id}`} className="min-w-0 flex-1">
            <h3
              className={cn(
                "line-clamp-2 font-medium",
                size === "compact" ? "text-sm" : "text-base",
              )}
            >
              {data.title}
            </h3>
            {size === "default" && (
              <>
                <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                  {compactViewCount} views • {compactDate}
                </p>
                <div className="my-3 flex items-center gap-2">
                  <UserAvatar
                    size={"sm"}
                    imageUrl={data.user.imageUrl}
                    name={data.user.name}
                  />
                  <UserInfo size={"sm"} name={data.user.name} />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-muted-foreground line-clamp-2 cursor-pointer text-xs">
                      {data.description || "No description"}
                    </p>
                  </TooltipTrigger>

                  <TooltipContent
                    side="bottom"
                    align="start"
                    alignOffset={0}
                    className="max-w-sm p-3 text-sm"
                  >
                    {data.description || "No description"}
                  </TooltipContent>
                </Tooltip>
              </>
            )}
            {size === "compact" && (
              <>
                <UserInfo size={"sm"} name={data.user.name} />
                <p className="text-muted-foreground mt-1 text-xs">
                  {compactViewCount} views • {compactLikeCount} likes
                </p>
              </>
            )}
          </Link>
          <div className="flex-none">
            <VideoMenu videoId={data.id} onRemove={onRemove} />
          </div>
        </div>
      </div>
    </div>
  );
};
