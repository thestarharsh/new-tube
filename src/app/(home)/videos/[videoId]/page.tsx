import { HydrateClient, trpc } from "@/trpc/server";

import { VideoView } from "@/modules/videos/ui/views/video-view";

interface VideoPageProps {
  params: Promise<{ videoId: string }>;
}

const VideoPage = async ({ params }: VideoPageProps) => {
  const { videoId } = await params;

  void trpc.videos.getOne.prefetch({ videoId });
  void trpc.comments.getMany.prefetch({ videoId }); // TODO: Change to prefetchInfinite later

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoPage;
