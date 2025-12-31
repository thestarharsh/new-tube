import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";

import { ResponsiveModal } from "./responsive-modal";

interface ThumbnailUploadModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThumbnailUploadModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailUploadModalProps) => {
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    utils.studio.getMany.invalidate();
    utils.studio.getOne.invalidate({ videoId });
    onOpenChange(false);
    toast.success("Thumbnail uploaded successfully");
  };

  return (
    <ResponsiveModal
      isOpen={open}
      onOpenChange={onOpenChange}
      title="Upload Thumbnail"
    >
      <div className="flex flex-col items-center justify-center">
        <UploadDropzone
          endpoint="thumbnailUploader"
          input={{ videoId }}
          onClientUploadComplete={onUploadComplete}
        />
      </div>
    </ResponsiveModal>
  );
};
