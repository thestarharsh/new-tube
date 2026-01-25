import { Loader2Icon } from "lucide-react";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

import { CommentItem } from "./comment-item";
import { Button } from "@/components/ui/button";

interface CommentRepliesProps {
  videoId: string;
  parentId: string;
}

export const CommentReplies = ({ videoId, parentId }: CommentRepliesProps) => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.comments.getMany.useInfiniteQuery(
      {
        videoId,
        parentId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  return (
    <div className="pl-14">
      <div className="mt-2 flex flex-col gap-4">
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2Icon className="text-muted-foreground size-6 animate-spin" />
          </div>
        )}
        {!isLoading &&
          data?.pages
            ?.flatMap((page) => page.items)
            .map((item) => (
              <CommentItem key={item.id} comment={item} variant="reply" />
            ))}
      </div>
      {hasNextPage && !isFetchingNextPage && (
        <Button
          disabled={isFetchingNextPage}
          size={"sm"}
          variant={"tertiary"}
          onClick={() => fetchNextPage()}
        >
          Show more
        </Button>
      )}
    </div>
  );
};
