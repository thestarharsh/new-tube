import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Edit2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { UserGetOneOutput } from "../../types";

interface UserPageBannerProps {
  user: UserGetOneOutput;
}

export const UserPageBannerSkeleton = () => {
  return (
    <Skeleton className="h-[15vh] max-h-50 w-full animate-pulse rounded-xl bg-gray-200 md:h-[25vh]" />
  );
};

export const UserPageBanner = ({ user }: UserPageBannerProps) => {
  const { userId } = useAuth();

  return (
    <div className="group relative">
      {/* TODO: Add banner upload modal */}
      <div
        className={cn(
          "h-[15vh] max-h-50 w-full rounded-xl bg-linear-to-r from-gray-100 to-gray-200 md:h-[25vh]",
          user?.bannerUrl ? "bg-cover bg-center" : "bg-gray-100",
        )}
        style={{
          backgroundImage: user?.bannerUrl ? `url(${user.bannerUrl})` : "none",
        }}
      >
        {user.clerkId === userId && (
          <Button
            className="absolute top-4 right-4 rounded-full bg-black/50 opacity-100 transition-opacity duration-300 group-hover:opacity-100 hover:bg-black/75 md:opacity-0"
            type="button"
          >
            <Edit2Icon className="size-4 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
};
