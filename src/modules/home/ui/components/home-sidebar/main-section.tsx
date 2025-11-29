"use client";

import { FlameIcon, HomeIcon, PlaySquareIcon } from "lucide-react";
import Link from "next/link";
import { useClerk, useAuth } from "@clerk/nextjs";

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const items = [
    {
        title: "Home",
        icon: HomeIcon,
        url: "/",
    },
    {
        title: "Subscriptions",
        icon: PlaySquareIcon,
        url: "/feed/subscriptions",
        auth: true,
    },
    {
        title: "Trending",
        icon: FlameIcon,
        url: "/feed/trending",
    },
];

export const MainSection = () => {
    const clerk = useClerk();
    const { isSignedIn } = useAuth();

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item, index) => (
                        <SidebarMenuItem key={index}>
                            <SidebarMenuButton tooltip={item.title} asChild isActive={false} onClick={(e) => {
                                if (!isSignedIn && item?.auth) {
                                    e.preventDefault();
                                    clerk.openSignIn();
                                }
                            }}>
                                <Link className="flex items-center gap-4" href={item.url}>
                                    <item.icon />
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};