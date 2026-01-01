import { useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";

import { VideoOwner } from "./video-owner";
import { VideoReactions } from "./video-reactions";
import { VideoMenu } from "./video-menu";
import { VideoDescription } from "./video-description";

import { VideoGetOneOutput } from "../../types";

interface VideoTopRowProps {
  video: VideoGetOneOutput;
}

export const VideoTopRow = ({ video }: VideoTopRowProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
    }).format(159025);
  }, []);

  const expandedViews = useMemo(() => {
    return Intl.NumberFormat("en-US", {
      notation: "standard",
    }).format(159025);
  }, []);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(video.createdAt, {
      addSuffix: true,
    });
  }, [video.createdAt]);

  const expandedDate = useMemo(() => {
    return format(video.createdAt, "MMM d, yyyy");
  }, [video.createdAt]);

  return (
    <div className="mt-4 flex flex-col gap-2">
      <h1 className="text-xl font-semibold">{video.title}</h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <VideoOwner user={video.user} videoId={video.id} />
        <div className="-mb-2 flex gap-2 overflow-x-auto pb-2 sm:mb-0 sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible sm:pb-0">
          <VideoReactions />
          <VideoMenu
            videoId={video.id}
            variant="secondary"
            onRemove={() => {}}
          />
        </div>
      </div>
      <VideoDescription
        compactViews={compactViews}
        expandedViews={expandedViews}
        compactDate={compactDate}
        expandedDate={expandedDate}
        description={video.description}
      />
    </div>
  );
};
