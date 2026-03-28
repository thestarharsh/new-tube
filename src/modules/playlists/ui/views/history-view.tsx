import { HistoryVideosSection } from "../sections/history-videos-section";

interface HistoryViewProps {}

export const HistoryView = ({}: HistoryViewProps) => {
  return (
    <div className="mx-auto mb-10 flex max-w-3xl flex-col gap-y-6 px-4 pt-2.5">
      <div>
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-muted-foreground text-xs">Recently watched videos</p>
      </div>
      <HistoryVideosSection />
    </div>
  );
};
