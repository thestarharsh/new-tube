import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";

import { ResponsiveModal } from "@/components/responsive-modal";

interface BannerUploadModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BannerUploadModal = ({
  userId,
  open,
  onOpenChange,
}: BannerUploadModalProps) => {
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    utils.users.getOne.invalidate({ id: userId });
    onOpenChange(false);
    toast.success("Banner uploaded successfully");
  };

  return (
    <ResponsiveModal
      isOpen={open}
      onOpenChange={onOpenChange}
      title="Upload Thumbnail"
    >
      <div className="flex flex-col items-center justify-center">
        <UploadDropzone
          endpoint="bannerUploader"
          onClientUploadComplete={onUploadComplete}
        />
      </div>
    </ResponsiveModal>
  );
};
