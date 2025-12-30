"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { GlobeIcon, LockIcon } from "lucide-react";

import { trpc } from "@/trpc/client";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { DEFAULT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail";

const VideosSectionSkeleton = () => {
  return (
    <>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-127.5 pl-6">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="pr-6 text-right">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-36" />
                    <div className="flex flex-col gap-y-1">
                      <Skeleton className="h-4 w-25" />
                      <Skeleton className="mt-2 h-3 w-37.5" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-4 w-12" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-4 w-12" />
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Skeleton className="ml-auto h-4 w-12" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

const VideosSectionSuspense = () => {
  const router = useRouter();

  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
    },
  );

  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-127.5 pl-6">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="pr-6 text-right">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages.flatMap((page) =>
              page.items.map((video) => {
                const handleNavigate = () => {
                  router.push(`/studio/videos/${video.id}`);
                };

                const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/studio/videos/${video.id}`);
                  }
                };

                return (
                  <TableRow
                    key={video.id}
                    className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    role="button"
                    tabIndex={0}
                    onClick={handleNavigate}
                    onKeyDown={handleKeyDown}
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-x-4">
                        <div className="relative aspect-video w-36 shrink-0">
                          <VideoThumbnail
                            title={video?.title}
                            duration={video?.duration}
                            imageUrl={video?.thumbnailUrl}
                            previewUrl={video?.previewUrl}
                          />
                        </div>
                        <div className="flex flex-col gap-y-1 overflow-hidden">
                          <span className="line-clamp-1 text-sm text-ellipsis">
                            {video?.title}
                          </span>
                          <span className="text-muted-foreground line-clamp-1 text-xs text-ellipsis">
                            {video?.description || "No Description"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {video.visibility === "private" ? (
                          <LockIcon className="mr-2 size-4" />
                        ) : (
                          <GlobeIcon className="mr-2 size-4" />
                        )}
                        {snakeCaseToTitleCase(video.visibility || "")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {snakeCaseToTitleCase(video.muxStatus || "")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate text-sm">
                        {format(new Date(video.createdAt), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">123</TableCell>
                    <TableCell className="text-right text-sm">45</TableCell>
                    <TableCell className="pr-6 text-right text-sm">
                      678
                    </TableCell>
                  </TableRow>
                );
              }),
            )}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};

export const VideosSection = () => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error loading videos...</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};
