import { HydrateClient, trpc } from "@/trpc/server";
import { HomeView } from "@/modules/home/ui/views/home-view";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId } = await searchParams;

   trpc.categories.getMany.prefetch();

  return (
    <div>
      <HydrateClient>
        <HomeView categoryId={categoryId} />
      </HydrateClient>
    </div>
  );
}

export default Page;
