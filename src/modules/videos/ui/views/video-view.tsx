import { CommentSection } from "../sections/comment-section";
import { SuggestionSection } from "../sections/suggestion-section";
import { VideoSection } from "../sections/video-section";

interface VideoViewProps {
  videoId: string;
}

export const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="mx-auto mb-10 flex max-w-425 flex-col px-4 pt-2.5">
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-1">
          <VideoSection videoId={videoId} />
          <div className="mt-4 block xl:hidden">
            <SuggestionSection />
          </div>
          <CommentSection videoId={videoId} />
        </div>
        <div className="hidden w-full shrink xl:block xl:w-95 2xl:w-115">
          <SuggestionSection />
        </div>
      </div>
    </div>
  );
};
