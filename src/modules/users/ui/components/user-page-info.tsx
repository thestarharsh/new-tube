import { useAuth, useClerk } from "@clerk/nextjs";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { SubscribeButton } from "@/modules/subscriptions/ui/components/subscribe-button";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";
import { cn } from "@/lib/utils";

import { UserGetOneOutput } from "../../types";

interface UserPageInfoProps {
  user: UserGetOneOutput;
}

export const UserPageInfoSkeleton = () => {
  return (
    <div className="py-6">
      {/* Mobile Layout */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <Skeleton className="h-15 w-15 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <Skeleton className="mt-3 h-9 w-full rounded-full" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden items-start gap-4 md:flex">
        <Skeleton className="size-40 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const UserPageInfo = ({ user }: UserPageInfoProps) => {
  const { userId, isLoaded } = useAuth();
  const clerk = useClerk();

  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
  });

  const onClickUserAvatar = () => {
    if (user.clerkId === userId) {
      clerk.openUserProfile();
    }
  };

  return (
    <div className="py-6">
      {/* Mobile Layout */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <UserAvatar
            size={"lg"}
            imageUrl={user?.imageUrl}
            name={user?.name}
            className="h-15 w-15"
            onClick={onClickUserAvatar}
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold">{user?.name}</h1>
            <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
              <span>{user.subscriberCount} Subscribers</span>
              <span>&bull;</span>
              <span>{user.videoCount} Videos</span>
            </div>
          </div>
        </div>
        {user?.clerkId === userId ? (
          <Button
            variant={"secondary"}
            asChild
            className="mt-3 w-full rounded-full"
          >
            <Link href="/studio">Go to Studio</Link>
          </Button>
        ) : (
          <SubscribeButton
            disabled={isPending || !isLoaded}
            isSubscribed={user.viewerSubscribed}
            onClick={onClick}
            className="mt-3 w-full"
          />
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden items-start gap-4 md:flex">
        <UserAvatar
          size={"xl"}
          imageUrl={user?.imageUrl}
          name={user?.name}
          className={cn(
            user?.clerkId === userId &&
              "cursor-pointer transition-opacity duration-300 hover:opacity-80",
          )}
          onClick={onClickUserAvatar}
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-4xl font-bold">{user?.name}</h1>
          <div className="text-muted-foreground mt-3 flex items-center gap-1 text-sm">
            <span>{user.subscriberCount} Subscribers</span>
            <span>&bull;</span>
            <span>{user.videoCount} Videos</span>
          </div>
          {user?.clerkId === userId ? (
            <Button variant={"secondary"} asChild className="mt-3 rounded-full">
              <Link href="/studio">Go to Studio</Link>
            </Button>
          ) : (
            <SubscribeButton
              disabled={isPending || !isLoaded}
              isSubscribed={user.viewerSubscribed}
              onClick={onClick}
              className="mt-3"
            />
          )}
        </div>
      </div>
    </div>
  );
};
