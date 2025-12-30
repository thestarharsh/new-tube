import { FormSection } from "../sections/form-section";

interface VideoViewProps {
  videoId: string;
}

export const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="max-w-5xl px-4 pt-2.5">
      <FormSection videoId={videoId} />
    </div>
  );
};
