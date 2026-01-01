import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { SubscribeButton } from "@/modules/subscriptions/ui/components/subscribe-button";
import { UserInfo } from "@/modules/users/ui/components/user-info";

import { VideoGetOneOutput } from "../../types";

interface VideoOwnerProps {
  user: VideoGetOneOutput["user"];
  videoId: VideoGetOneOutput["id"];
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { userId } = useAuth();

  return (
    <div className="flex min-w-0 items-center justify-between gap-3 sm:items-start sm:justify-start">
      <Link href={`/users/${user.id}`}>
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar size={"lg"} imageUrl={user.imageUrl} name={user.name} />
          <div className="flex min-w-0 flex-col gap-0.75">
            <UserInfo name={user.name} />
            <span className="text-muted-foreground line-clamp-1 text-sm">
              {/* TODO: Add subscriber count */}
              {0} Subscribers
            </span>
          </div>
        </div>
      </Link>
      {userId === user.clerkId ? (
        <Button className="rounded-full" asChild variant={"secondary"}>
          <Link href={`/studio/videos/${videoId}`}>Edit</Link>
        </Button>
      ) : (
        <SubscribeButton
          isSubscribed={false}
          onClick={() => {}}
          disabled={false}
        />
      )}
    </div>
  );
};
