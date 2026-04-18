"use client";

import { ClapperboardIcon, UserCircleIcon, UserIcon } from "lucide-react";
import { UserButton, SignInButton, Show } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export const AuthButton = () => {
  return (
    <>
      <Show when="signed-in">
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="My Profile"
              labelIcon={<UserIcon className="size-4" />}
              href="/users/current"
            />
            <UserButton.Link
              label="Studio"
              labelIcon={<ClapperboardIcon className="size-4" />}
              href="/studio"
            />
            <UserButton.Action label="manageAccount" />
          </UserButton.MenuItems>
        </UserButton>
      </Show>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button
            variant={"outline"}
            className="rounded-full border-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-600 shadow-none hover:text-blue-500"
          >
            <UserCircleIcon />
            Sign In
          </Button>
        </SignInButton>
      </Show>
    </>
  );
};
