"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PlaylistCreateModal } from "../components/playlist-create-modal";
import { PlaylistSection } from "../sections/playlist-section";

interface PlaylistsViewProps {}

export const PlaylistsView = ({}: PlaylistsViewProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="mx-auto mb-10 flex max-w-600 flex-col gap-y-6 px-4 pt-2.5">
      <PlaylistCreateModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Playlists</h1>
          <p className="text-muted-foreground text-xs">
            Your created playlists
          </p>
        </div>
        <Button
          variant={"outline"}
          size={"icon"}
          className="rounded-full"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusIcon />
        </Button>
      </div>
      <PlaylistSection />
    </div>
  );
};
