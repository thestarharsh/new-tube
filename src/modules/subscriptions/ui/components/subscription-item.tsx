import { UserAvatar } from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { SubscribeButton } from "./subscribe-button";

interface SubscriptionItemProps {
  name: string;
  imageUrl: string;
  subscriberCount: number;
  unsubscribe: () => void;
  disabled: boolean;
}

export const SubscriptionItemSkeleton = () => {
  return (
    <div className="flex items-start gap-4">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
};
export const SubscriptionItem = ({
  name,
  imageUrl,
  subscriberCount,
  unsubscribe,
  disabled,
}: SubscriptionItemProps) => {
  return (
    <div className="flex items-start gap-4">
      <UserAvatar name={name} imageUrl={imageUrl} size={"lg"} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm">{name}</h3>
            <p className="text-muted-foreground text-xs">
              {subscriberCount} subscribers
            </p>
          </div>
          <SubscribeButton
            size="sm"
            onClick={(e) => {
              e?.preventDefault();
              e?.stopPropagation();
              unsubscribe();
            }}
            disabled={disabled}
            isSubscribed
          />
        </div>
      </div>
    </div>
  );
};
