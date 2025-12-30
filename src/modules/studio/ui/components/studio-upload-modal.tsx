"use client";

import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/responsive-modal";
import { StudioUploader } from "./studio-uploader";

export const StudioUploadModal = () => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("Video Created");
    },
    onError: (error) => {
      toast.error("Video Creation Failed: " + error.message);
    },
  });

  const onSuccess = () => {
    if (!create?.data?.video?.id) return;
    create.reset();
    router.push(`/studio/videos/${create?.data?.video?.id}`);
  };

  return (
    <>
      <ResponsiveModal
        isOpen={!!create.data}
        onOpenChange={() => create.reset()}
        title="Upload Video"
      >
        {create?.data?.url ? (
          <StudioUploader endpoint={create?.data?.url} onSuccess={onSuccess} />
        ) : (
          <Loader2Icon />
        )}
      </ResponsiveModal>
      <Button
        variant={"secondary"}
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {create.isPending ? <Loader2Icon /> : <PlusIcon />}
        Create
      </Button>
    </>
  );
};
