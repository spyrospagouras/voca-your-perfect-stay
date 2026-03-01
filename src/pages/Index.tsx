import { useRef, useCallback, useEffect } from "react";
import SearchBar from "@/components/home/SearchBar";
import CategoryTabs from "@/components/home/CategoryTabs";
import FeedCard from "@/components/home/FeedCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 10;

const Index = () => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["home-listings-feed"],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from("listings")
        .select(
          "id, title, cover_image_url, images, city, location_name, price_per_night, rating, property_type, privacy_type"
        )
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .range(from, to);
      if (error) throw error;
      return data ?? [];
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
  });

  const listings = data?.pages.flat() ?? [];

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "200px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="bg-background min-h-full">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-background">
        <SearchBar />
        <CategoryTabs />
      </div>

      {/* Feed */}
      <div className="px-4 pb-24 pt-2 space-y-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <FeedCardSkeleton key={i} />
            ))
          : listings.length === 0
          ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-muted-foreground text-sm">
                Δεν βρέθηκαν καταλύματα αυτή τη στιγμή.
              </p>
            </div>
          )
          : listings.map((l) => (
              <FeedCard
                key={l.id}
                id={l.id}
                image={
                  l.cover_image_url ||
                  (l.images && l.images.length > 0 ? l.images[0] : "/placeholder.svg")
                }
                title={l.title}
                location={l.city || l.location_name || ""}
                propertyType={l.property_type || ""}
                price={l.price_per_night ?? 0}
                rating={l.rating ?? null}
              />
            ))}

        {isFetchingNextPage &&
          Array.from({ length: 2 }).map((_, i) => (
            <FeedCardSkeleton key={`loading-${i}`} />
          ))}

        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} className="h-1" />
      </div>
    </div>
  );
};

const FeedCardSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
    <div className="flex items-start justify-between">
      <div className="space-y-1.5 flex-1">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
        <Skeleton className="h-4 w-1/3 rounded" />
      </div>
      <Skeleton className="h-4 w-10 rounded" />
    </div>
  </div>
);

export default Index;
