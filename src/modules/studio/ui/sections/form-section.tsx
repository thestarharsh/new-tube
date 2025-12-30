"use client";

import { Suspense, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { ErrorBoundary } from "react-error-boundary";
import {
  CopyCheckIcon,
  CopyIcon,
  GlobeIcon,
  LockIcon,
  MoreVerticalIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { trpc } from "@/trpc/client";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/confirmation-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { videosUpdateSchema } from "@/db/schema";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";

interface FormSectionProps {
  videoId: string;
}

const FormSectionSuspence = ({ videoId }: FormSectionProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [video] = trpc.studio.getOne.useSuspenseQuery({ videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ videoId });
      toast.success("Video Updated Successfully");
    },
    onError: (error) => {
      toast.error("Video Update Failed: " + error.message);
    },
  });

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("Video Removed Successfully");
      router.push("/studio");
    },
    onError: (error) => {
      toast.error("Video Removal Failed: " + error.message);
    },
  });

  const form = useForm<z.infer<typeof videosUpdateSchema>>({
    resolver: zodResolver(videosUpdateSchema),
    defaultValues: video,
  });

  const onSubmit = (data: z.infer<typeof videosUpdateSchema>) => {
    update.mutate(data);
  };

  const onDeleteVideo = () => {
    setIsOpen(true);
  };

  const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/videos/${videoId}`;

  const onCopy = async () => {
    navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    toast.success("URL Copied to Clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onCancel={() => setIsOpen(false)}
        onConfirm={() => {
          remove.mutate({ videoId });
          setIsOpen(false);
        }}
        title="Delete Video"
        message="Are you sure you want to delete this video?"
        subMessage="This action cannot be undone."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Video Details</h1>
              <p className="text-muted-foreground text-xs">
                Manage your video here
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={update.isPending}>
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onDeleteVideo}>
                    <TrashIcon className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="space-y-8 lg:col-span-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Title {/* TODO: Add AI Generate Button */}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter video title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description {/* TODO: Add AI Generate Button */}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter video description"
                        rows={10}
                        className="min-h-60 resize-none pr-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/** TODO: Add Thumbnail Field Here */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent side="bottom">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-y-8 lg:col-span-2">
              <div className="flex h-fit flex-col gap-4 overflow-hidden rounded-xl bg-[#f9f9f9]">
                <div className="relative aspect-video overflow-hidden">
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>
                <div className="flex flex-col gap-y-6 p-4">
                  <div className="flex items-center justify-between gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Video Link
                      </p>
                      <div className="flex items-center gap-x-2">
                        <Link href={`/videos/${video.id}`} target="_blank">
                          <p className="line-clamp-1 text-sm text-blue-500">
                            {fullUrl}
                          </p>
                        </Link>
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          type="button"
                          className="shrink-0"
                          onClick={onCopy}
                          disabled={isCopied}
                        >
                          {isCopied ? (
                            <CopyCheckIcon className="size-4" />
                          ) : (
                            <CopyIcon className="size-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Video Status
                      </p>
                      <p className="text-sm">
                        {snakeCaseToTitleCase(video.muxStatus || "preparing")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Subtitle Status
                      </p>
                      <p className="text-sm">
                        {snakeCaseToTitleCase(
                          video.muxTrackStatus || "no_subtitles",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key="public" value="public">
                          <GlobeIcon className="mr-2 size-4" />
                          Public
                        </SelectItem>
                        <SelectItem key="private" value="private">
                          <LockIcon className="mr-2 size-4" />
                          Private
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

const FormSectionSkeleton = () => {
  return (
    <div className="">
      <p>Loading video form...</p>
    </div>
  );
};

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error loading video form...</p>}>
        <FormSectionSuspence videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};
