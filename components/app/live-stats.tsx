"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export function LiveStats() {
  const stats = useQuery(api.checkins.activeStats);
  if (!stats) {
    return <Skeleton className="h-5 w-48 mx-auto" />;
  }
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      <span className="font-medium tabular-nums">{stats.activeCount} live</span>
      <span className="text-muted-foreground">·</span>
      <span className="tabular-nums text-muted-foreground">{stats.uniqueBuilders} builders</span>
    </div>
  );
}
