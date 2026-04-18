import { Show } from "@clerk/nextjs";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import { MainSection } from "./main-section";
import { PersonalSection } from "./personal-section";
import { SubscriptionsSection } from "./subsciptions-section";

export const HomeSidebar = () => {
  return (
    <Sidebar className="z-40 border-none pt-16" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />
        <Separator />
        <PersonalSection />
        <Show when={"signed-in"}>
          <SubscriptionsSection />
          <Separator />
        </Show>
      </SidebarContent>
    </Sidebar>
  );
};
