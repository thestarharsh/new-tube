"use client";

import { HistoryIcon, ListVideoIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";
import { useClerk, useAuth } from "@clerk/nextjs";

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const items = [
    {
        title: "History",
        icon: HistoryIcon,
        url: "/playlists/history",
        auth: true,
    },
    {
        title: "Liked Videos",
        icon: ThumbsUpIcon,
        url: "/playlists/liked-videos",
        auth: true,
    },
    {
        title: "All Playlists",
        icon: ListVideoIcon,
        url: "/playlists",
        auth: true,
    },
];

export const PersonalSection = () => {
    const clerk = useClerk();
    const { isSignedIn } = useAuth();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>You</SidebarGroupLabel>
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