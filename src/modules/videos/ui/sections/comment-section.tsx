"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Loader2Icon } from "lucide-react";

import { ErrorMessage } from "@/components/error-message";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";
import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import { CommentItem } from "@/modules/comments/ui/components/comment-item";
import { DEFAULT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";

interface CommentSectionProps {
  videoId: string;
}

const CommentSectionSuspense = ({ videoId }: CommentSectionProps) => {
  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
    },
  );

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold">
          {comments?.pages[0]?.totalCount} Comments
        </h1>
        <CommentForm videoId={videoId} />
        <div className="mt-2 flex flex-col gap-4">
          {comments?.pages.flatMap((page) =>
            page.items.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            )),
          )}
          <InfiniteScroll
            isManual
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
          />
        </div>
      </div>
    </div>
  );
};

const CommentsSectionSkeleton = () => {
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        {/* Total count skeleton */}
        <Skeleton className="h-7 w-32" />

        {/* Comment form skeleton */}
        <div className="flex gap-4">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-20 w-full" />
            <div className="mt-2 flex justify-end">
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>

        {/* Loader */}
        <div className="mt-2 flex items-center justify-center">
          <Loader2Icon className="text-muted-foreground size-6 animate-spin" />
        </div>
      </div>
    </div>
  );
};

export const CommentSection = ({ videoId }: CommentSectionProps) => {
  return (
    <Suspense fallback={<CommentsSectionSkeleton />}>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <ErrorMessage message={"Failed to load comments"} />
        )}
      >
        <CommentSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};
