import { HydrateClient, trpc } from "@/trpc/server";

import { VideoView } from "@/modules/videos/ui/views/video-view";
import { DEFAULT_LIMIT } from "@/constants";

export const dynamic = "force-dynamic";

interface VideoPageProps {
  params: Promise<{ videoId: string }>;
}

const VideoPage = async ({ params }: VideoPageProps) => {
  const { videoId } = await params;

  void trpc.videos.getOne.prefetch({ videoId });
  void trpc.comments.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });
  void trpc.suggestions.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoPage;
