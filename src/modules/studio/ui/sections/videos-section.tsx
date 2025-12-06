"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
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
import { useRouter } from "next/navigation";

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
              <TableHead className="w-[510px] pl-6">Video</TableHead>
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
                    <TableCell>{video?.title}</TableCell>
                    <TableCell>Visible</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Published</TableCell>
                    <TableCell>123</TableCell>
                    <TableCell>45</TableCell>
                    <TableCell>678</TableCell>
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
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error loading videos...</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};
