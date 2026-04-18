"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ErrorMessage } from "@/components/error-message";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/trpc/client";

import {
  UserPageBannerSkeleton,
  UserPageBanner,
} from "../components/user-page-banner";
import {
  UserPageInfo,
  UserPageInfoSkeleton,
} from "../components/user-page-info";

interface UserSectionProps {
  userId: string;
}

const UserSectionSuspense = ({ userId }: UserSectionProps) => {
  const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId });
  return (
    <div className="flex flex-col">
      <UserPageBanner user={user} />
      <UserPageInfo user={user} />
      <Separator />
    </div>
  );
};

const UserSectionSkeleton = () => {
  return (
    <div className="flex flex-col">
      <UserPageBannerSkeleton />
      <UserPageInfoSkeleton />
      <Separator />
    </div>
  );
};

export const UserSection = ({ userId }: UserSectionProps) => {
  return (
    <Suspense fallback={<UserSectionSkeleton />}>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <ErrorMessage message={"Failed to load user"} />
        )}
      >
        <UserSectionSuspense userId={userId} />
      </ErrorBoundary>
    </Suspense>
  );
};
