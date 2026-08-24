"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MapView } from "@/components/app/map-view";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  const checkins = useQuery(api.checkins.getAllActive);

  if (checkins === undefined) {
    return (
      <div className="mx-auto max-w-6xl p-4 py-8">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  const mapCheckins = checkins.map((c) => ({
    id: c._id,
    lat: c.lat,
    lng: c.lng,
    note: c.note,
    shareId: c._id,
    userImageUrl: c.userImageUrl,
    placeName: c.placeName,
    clerkId: c.clerkId,
    startedAt: c.startedAt,
    status: c.status,
    participants: c.participants,
  }));

  const center =
    mapCheckins.length > 0
      ? {
          lat: mapCheckins.reduce((s, c) => s + c.lat, 0) / mapCheckins.length,
          lng: mapCheckins.reduce((s, c) => s + c.lng, 0) / mapCheckins.length,
        }
      : { lat: 37.7749, lng: -122.4194 };

  return (
    <div className="mx-auto w-full max-w-6xl p-4 py-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Admin — Live check-ins</CardTitle>
              <CardDescription>All active sessions across the platform.</CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono">
              {checkins.length} active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[560px] overflow-hidden rounded-xl border">
            <MapView center={center} checkins={mapCheckins} className="h-full w-full rounded-none border-0 shadow-none" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
