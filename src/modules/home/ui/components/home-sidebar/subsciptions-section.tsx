"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trpc } from "@/trpc/client";

import { DEFAULT_LIMIT } from "@/constants";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { ListIcon } from "lucide-react";

export const SubscriptionsSectionSkeleton = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {Array.from({ length: 4 }).map((_, i) => (
            <SidebarMenuItem key={i}>
              <div className="flex items-center gap-4 px-2 py-1">
                <Skeleton className="size-4 shrink-0 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <div className="flex items-center gap-4 px-2 py-1">
              <Skeleton className="size-4 shrink-0" />
              <Skeleton className="h-4 w-32" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export const SubscriptionsSection = () => {
  const pathname = usePathname();
  const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
    },
  );

  if (isLoading) {
    return <SubscriptionsSectionSkeleton />;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {data?.pages
            ?.flatMap((page) => page.items)
            .map((subscription) => (
              <SidebarMenuItem
                key={`${subscription.createdAt}_${subscription.viewerId}`}
              >
                <SidebarMenuButton
                  tooltip={subscription.user.name}
                  asChild
                  isActive={pathname === `/users/${subscription.user.id}`}
                >
                  <Link
                    className="flex items-center gap-4"
                    href={`/users/${subscription.user.id}`}
                  >
                    <UserAvatar
                      size="xs"
                      imageUrl={subscription.user.imageUrl}
                      name={subscription.user.name}
                    />
                    <span className="text-sm">{subscription.user.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          <SidebarMenuButton asChild isActive={pathname === "/subscriptions"}>
            <Link href="/subscriptions" className="flex items-center gap-4">
              <ListIcon className="size-4" />
              <span className="text-sm">All Subscriptions</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
