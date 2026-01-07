"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/error-message";
import { trpc } from "@/trpc/client";
import { CommentForm } from "@/modules/comments/ui/components/comment-form";

interface CommentSectionProps {
  videoId: string;
}

const CommentSectionSuspense = ({ videoId }: CommentSectionProps) => {
  const [comments] = trpc.comments.getMany.useSuspenseQuery({ videoId });

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1>{comments?.length} Comments</h1>
        <CommentForm videoId={videoId} />
      </div>
      <p>{JSON.stringify(comments)}</p>
    </div>
  );
};

const CommentsSectionSkeleton = () => {
  return <Skeleton />;
};

export const CommentSection = ({ videoId }: CommentSectionProps) => {
  return (
    <Suspense fallback={<CommentsSectionSkeleton />}>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <ErrorMessage message={error.message || "Failed to load comments"} />
        )}
      >
        <CommentSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};
