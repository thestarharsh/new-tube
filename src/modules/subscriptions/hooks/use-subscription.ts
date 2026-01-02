import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";
import { trpc } from "@/trpc/client";

interface UseSubscriptionProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}

export const useSubscription = ({
  userId,
  isSubscribed,
  fromVideoId,
}: UseSubscriptionProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const subscribe = trpc.subscriptions.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Subscribed");
      // TODO: Add videos.getMany, users.getOne as well
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ videoId: fromVideoId });
      }
    },
    onError: (error) => {
      if (error?.data?.code === "UNAUTHORIZED") {
        toast.error("Please sign in to subscribe");
        clerk.openSignIn();
        return;
      }

      toast.error("Something went wrong");
    },
  });
  const unsubscribe = trpc.subscriptions.unsubscribe.useMutation({
    onSuccess: () => {
      toast.success("Unsubscribed");
      // TODO: Add videos.getMany, users.getOne as well
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ videoId: fromVideoId });
      }
    },
    onError: (error) => {
      if (error?.data?.code === "UNAUTHORIZED") {
        toast.error("Please sign in to unsubscribe");
        clerk.openSignIn();
        return;
      }

      toast.error("Something went wrong");
    },
  });

  const isPending = subscribe.isPending || unsubscribe.isPending;

  const onClick = () => {
    if (isSubscribed) {
      unsubscribe.mutate({ userId });
    } else {
      subscribe.mutate({ userId });
    }
  };

  return {
    isPending,
    onClick,
  };
};
