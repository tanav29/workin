"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { MapView } from "@/components/app/map-view";
import { useCurrentLocation } from "@/components/app/location";
import { CheckinPanel } from "@/components/app/checkin-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs";
import { Navigation, MapPin, Loader2, AlertCircle } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const { state: locationState, request: requestLocation } = useCurrentLocation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState("10");
  const { userId } = useAuth();

  const coords = locationState.status === "ready" ? { lat: locationState.lat, lng: locationState.lng } : null;
  const radiusValue = Number.parseFloat(radiusKm);

  const nearby = useQuery(
    api.checkins.activeNearby,
    coords ? { lat: coords.lat, lng: coords.lng, radiusKm: Number.isFinite(radiusValue) ? radiusValue : 10 } : "skip"
  );

  const mapCheckins = useMemo(() => {
    const list = nearby ?? [];
    return list.map((c) => ({
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
      visibility: c.visibility,
      participants: c.participants,
    }));
  }, [nearby]);

  if (!coords) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-muted/20 px-4 py-16">
        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl border bg-background">
              <MapPin className="size-5" />
            </div>
            <h2 className="text-base font-semibold tracking-tight">Enable location</h2>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">We need your location to show builders working nearby. Your exact position stays private unless you check in.</p>
            {locationState.status === "denied" && (
              <div className="mt-4 flex w-full items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-left">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                <p className="text-xs leading-5 text-muted-foreground">{locationState.message}</p>
              </div>
            )}
            <Button className="mt-6 w-full" onClick={requestLocation} disabled={locationState.status === "loading"}>
              {locationState.status === "loading" ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Locating…
                </>
              ) : (
                <>
                  <Navigation className="size-4" /> Enable location
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 relative">
      <div className="flex-1 relative">
        <MapView
          center={coords}
          checkins={mapCheckins}
          onCheckin={(id) => router.push(`/c/${id}`)}
          className="h-full w-full rounded-none border-0"
          selectedId={selectedId}
          onSelectId={setSelectedId}
        />
      </div>

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 p-3">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-3">
          <div className="pointer-events-auto flex items-center gap-2 rounded-xl border bg-background/95 px-3 py-2 shadow-sm backdrop-blur">
            <span className="text-xs font-medium tracking-tight">Radius</span>
            <Select value={radiusKm} onValueChange={(value) => value !== null && setRadiusKm(value)}>
              <SelectTrigger className="text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 km</SelectItem>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="25">25 km</SelectItem>
              </SelectContent>
            </Select>
            <span className="hidden sm:inline text-xs text-muted-foreground">· {mapCheckins.length} nearby</span>
          </div>

          <Badge variant="secondary" className="pointer-events-auto hidden sm:inline-flex bg-background/95 backdrop-blur font-mono text-xs">
            {coords.lat.toFixed(3)}, {coords.lng.toFixed(3)}
          </Badge>
        </div>
      </div>

      {/* Bottom checkin */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <div className="mx-auto max-w-sm pointer-events-auto">
          <CheckinPanel coords={coords} />
          {!userId && <p className="mt-2 text-center text-xs text-muted-foreground">Sign in to wave or join.</p>}
        </div>
      </div>
    </div>
  );
}
