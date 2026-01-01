import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// TODO
export const VideoReactions = () => {
  const viewerReaction = "like";

  return (
    <div className="flex flex-none items-center">
      <Button
        className="gap-2 rounded-l-full rounded-r-none pr-4"
        variant={"secondary"}
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {1}
      </Button>
      <Separator className="h-6" orientation="vertical" />
      <Button
        className="rounded-l-none rounded-r-full pl-3"
        variant={"secondary"}
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction !== "like" && "fill-black")}
        />
        {1}
      </Button>
    </div>
  );
};
