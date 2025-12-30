import { HydrateClient, trpc } from "@/trpc/server";

import { VideoView } from "@/modules/studio/ui/views/video-view";

export const dynamic = "force-dynamic";

interface VideoPageParams {
  params: Promise<{ videoId: string }>;
}

const VideoPage = async ({ params }: VideoPageParams) => {
  const { videoId } = await params;

  void trpc.studio.getOne.prefetch({ videoId });
  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoPage;
