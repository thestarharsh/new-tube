import { LikedVideosSection } from "../sections/liked-videos-section";

interface LikedVideosViewProps {}

export const LikedVideosView = ({}: LikedVideosViewProps) => {
  return (
    <div className="mx-auto mb-10 flex max-w-3xl flex-col gap-y-6 px-4 pt-2.5">
      <div>
        <h1 className="text-2xl font-bold">Liked Videos</h1>
        <p className="text-muted-foreground text-xs">
          Videos you liked recently
        </p>
      </div>
      <LikedVideosSection />
    </div>
  );
};
