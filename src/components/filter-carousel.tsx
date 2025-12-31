"use client";

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface FilterCarouselProps {
  value?: string | null;
  isLoading?: boolean;
  onSelect?: (value: string | null) => void;
  data: {
    value: string;
    label: string;
  }[];
}

export const FilterCarousel = ({
  value,
  isLoading,
  onSelect,
  data,
}: FilterCarouselProps) => {
  const [api, setApi] = useState<CarouselApi | undefined>();
  const [current, setCurrent] = useState<number>(0);

  const count = useMemo(() => api?.scrollSnapList().length ?? 0, [api]);
  const derivedSelected = useMemo(
    () => (api ? api.selectedScrollSnap() + 1 : 0),
    [api],
  );

  useEffect(() => {
    if (!api) return;

    const raf = requestAnimationFrame(() => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);

    return () => {
      cancelAnimationFrame(raf);
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    if (!value) {
      api.scrollTo(0);
      return;
    }
    const idx = data.findIndex((it) => it.value === value);
    if (idx >= 0) api.scrollTo(idx + 1);
  }, [value, api, data]);

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "pointer-events-none absolute top-0 bottom-0 left-8 z-10 w-12 bg-linear-to-r from-white to-transparent",
          (derivedSelected === 1 || current === 1) && "hidden",
        )}
      />

      <Carousel
        setApi={setApi}
        className="w-full px-12"
        opts={{
          align: "start",
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-3" style={{ touchAction: "pan-y" }}>
          <CarouselItem
            onClick={() => onSelect?.(null)}
            className="basis-auto pl-3"
          >
            <Badge
              variant={!value ? "default" : "secondary"}
              className="cursor-pointer rounded-lg px-3 py-1 text-sm whitespace-nowrap select-none"
            >
              All
            </Badge>
          </CarouselItem>

          {isLoading &&
            Array.from({ length: 14 }).map((_, index) => (
              <CarouselItem key={index} className="basis-auto pl-3">
                <Skeleton className="h-full w-25 rounded-lg px-3 py-1 text-sm">
                  &nbsp;
                </Skeleton>
              </CarouselItem>
            ))}

          {!isLoading &&
            data.map((item) => (
              <CarouselItem
                onClick={() => onSelect?.(item.value)}
                key={item.value}
                className="basis-auto pl-3"
              >
                <Badge
                  variant={value === item.value ? "default" : "secondary"}
                  className="cursor-pointer rounded-lg px-3 py-1 text-sm whitespace-nowrap select-none"
                >
                  {item.label}
                </Badge>
              </CarouselItem>
            ))}
        </CarouselContent>

        <CarouselPrevious className="left-0 z-20" />
        <CarouselNext className="right-0 z-20" />
      </Carousel>

      <div
        className={cn(
          "pointer-events-none absolute top-0 right-8 bottom-0 z-10 w-12 bg-linear-to-l from-white to-transparent",
          current === count && "hidden",
        )}
      />
    </div>
  );
};
