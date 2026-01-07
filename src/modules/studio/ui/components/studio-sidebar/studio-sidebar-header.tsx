import Link from "next/link";
import { useUser } from "@clerk/nextjs";

import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";

export const StudioSidebarHeader = () => {
  const { user } = useUser();
  const { state } = useSidebar();

  if (!user) {
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="size-28 rounded-full" />
        <div className="mt-2 flex flex-col items-center gap-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-4 w-28" />
        </div>
      </SidebarHeader>
    );
  }

  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={"Your Profile"} asChild>
          <Link href="/users/current">
            <UserAvatar
              imageUrl={user?.imageUrl || ""}
              name={user?.fullName || "User"}
              size={"xs"}
            />
            <span className="text-sm">Your Profile</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link href="/usres/current">
        <UserAvatar
          imageUrl={user?.imageUrl || ""}
          name={user?.fullName || "User"}
          className="size-28 transition-opacity hover:opacity-80"
        />
      </Link>
      <div className="mt-2 flex flex-col items-center gap-y-1">
        <p className="text-sm font-medium">Your Profile</p>
        <p className="text-muted-foreground text-xs">{user?.fullName}</p>
      </div>
    </SidebarHeader>
  );
};
