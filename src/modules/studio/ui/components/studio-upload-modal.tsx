"use client";

import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";

export const StudioUploadModal = () => {
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

  return (
    <Button
      variant={"secondary"}
      onClick={() => create.mutate()}
      disabled={create.isPending}
    >
      {create.isPending ? <Loader2Icon /> : <PlusIcon />}
      Create
    </Button>
  );
};
