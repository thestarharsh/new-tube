"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/navigation";

import { trpc } from "@/trpc/client";
import { FilterCarousel } from "@/components/filter-carousel";

interface CategoriesSectionProps {
  categoryId?: string;
}

const CategoriesSectionSuspense = ({ categoryId }: CategoriesSectionProps) => {
    const router = useRouter();
    const [categories] = trpc.categories.getMany.useSuspenseQuery();

    const data = categories.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    const onSelect = (value: string | null) => {
        const url = new URL(window.location.href);
        
        if (value) {
            url.searchParams.set("categoryId", value);
        } else {
            url.searchParams.delete("categoryId");
        }

        router.push(url.toString());
    }

  return (
      <FilterCarousel
          value={categoryId}
          onSelect={onSelect}
          isLoading={false}
          data={data}
      />
  );
}

const CategoriesSkeleton = () => (
    <FilterCarousel isLoading={true} data={[]} />
)

export const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
  return (
      <Suspense fallback={<CategoriesSkeleton />}>
          <ErrorBoundary fallback={<p>Error loading categories...</p>}>
            <CategoriesSectionSuspense categoryId={categoryId} />
          </ErrorBoundary>
    </Suspense>
  );
}