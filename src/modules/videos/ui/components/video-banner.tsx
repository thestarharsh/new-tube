import { AlertTriangleIcon } from "lucide-react";
import { VideoGetOneOutput } from "../../types";

interface VideoBannerProps {
  status: VideoGetOneOutput["muxStatus"];
}

export const VideoBanner = ({ status }: VideoBannerProps) => {
  if (status !== "ready") {
    return (
      <div className="x-4 flex items-center gap-2 rounded-b-xl bg-yellow-400 py-3">
        <AlertTriangleIcon className="h-12 w-12 text-white" />
        <p className="line-clamp-1 text-xs font-medium text-black md:text-sm">
          This video is still processing
        </p>
      </div>
    );
  }
  return null;
};
