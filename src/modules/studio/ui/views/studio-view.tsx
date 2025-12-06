import { VideosSection } from "../sections/videos-section";

export const StudioView = () => {
  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <div className="px-4">
        <h2 className="text-2xl font-bold">Channel Content</h2>
        <p className="text-muted-foreground text-xs">
          Manage your channel content and videos
        </p>
      </div>
      <VideosSection />
    </div>
  );
};
