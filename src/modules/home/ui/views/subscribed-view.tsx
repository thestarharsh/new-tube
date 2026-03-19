import { SubscribedVideosSection } from "../sections/subscribed-videos-section";

interface SubscribedViewProps {}

export const SubscribedView = ({}: SubscribedViewProps) => {
  return (
    <div className="mx-auto mb-10 flex max-w-600 flex-col gap-y-6 px-4 pt-2.5">
      <div>
        <h1 className="text-2xl font-bold">Subscribed</h1>
        <p className="text-muted-foreground text-xs">
          Videos from channels you subscribe to
        </p>
      </div>
      <SubscribedVideosSection />
    </div>
  );
};
