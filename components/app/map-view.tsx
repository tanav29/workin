"use client";

import * as React from "react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from "@/components/ui/map";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hand, ExternalLink } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

function timeHere(startedAt?: number) {
  if (!startedAt) return null;
  const s = Math.floor((Date.now() - startedAt) / 1000);
  if (s < 60) return "now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export function MapView({
  center,
  checkins,
  onCheckin,
  className,
  selectedId: controlledSelectedId,
  onSelectId: controlledOnSelectId,
}: {
  center: { lat: number; lng: number };
  checkins: Array<{
    id: string;
    lat: number;
    lng: number;
    note: string;
    shareId: string;
    userImageUrl: string;
    placeName: string;
    clerkId: string;
    participants?: string[];
    startedAt?: number;
    status?: string;
    visibility?: string;
  }>;
  onCheckin?: (shareId: string) => void;
  className?: string;
  selectedId?: string | null;
  onSelectId?: (id: string | null) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState<string | null>(null);
  const isControlled = controlledSelectedId !== undefined;
  const open = isControlled ? controlledSelectedId : internalOpen;
  const setOpen = React.useCallback(
    (id: string | null) => {
      controlledOnSelectId?.(id);
      if (!isControlled) setInternalOpen(id);
    },
    [controlledOnSelectId, isControlled]
  );

  const { userId } = useAuth();
  const router = useRouter();
  const sayHello = useMutation(api.users.sayHello);
  const sendJoinRequest = useMutation(api.notifications.sendJoinRequest);
  const { resolvedTheme } = useTheme();

  const handleSayHi = async (clerkId: string) => {
    if (!userId) return toast.error("Sign in to wave");
    if (clerkId === userId) return toast.error("Can’t wave to yourself");
    try {
      await sayHello({ clerkId });
      toast.success("Waved 👋");
    } catch {
      toast.error("Failed");
    }
  };

  const handleJoin = async (id: Id<"checkins">, clerkId: string) => {
    if (!userId) return toast.error("Sign in to request");
    if (clerkId === userId) return toast.error("Can’t join your own");
    try {
      await sendJoinRequest({ checkinId: id });
      toast.success("Request sent");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <Card className={`overflow-hidden border bg-card p-0 shadow-none ${className}`}>
      <div className="h-full w-full relative">
        <Map center={[center.lng, center.lat]} zoom={13} theme={resolvedTheme === "dark" ? "dark" : "light"}>
          <MapControls showLocate position="bottom-right" />

          <MapMarker longitude={center.lng} latitude={center.lat}>
            <MarkerContent>
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-blue-500/15 animate-pulse" />
                <div className="relative size-3 rounded-full border-2 border-white bg-blue-500 shadow" />
              </div>
            </MarkerContent>
          </MapMarker>

          {checkins.map((c) => {
            const isSelected = open === c.id;
            return (
              <MapMarker key={c.id} longitude={c.lng} latitude={c.lat} onClick={() => setOpen(c.id)}>
                <MarkerContent>
                  <div className={`rounded-full p-0.5 bg-background shadow-md transition-all ${isSelected ? "ring-2 ring-foreground scale-105" : "ring-1 ring-border"}`}>
                    <Avatar className="size-8">
                      <AvatarImage src={c.userImageUrl} alt="" />
                      <AvatarFallback className="text-[10px]">U</AvatarFallback>
                    </Avatar>
                  </div>
                  {c.status && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border bg-background px-1.5 py-0.5 text-[10px] font-medium leading-none shadow-sm">
                      {c.status === "Open to chat" ? "Open" : c.status}
                    </div>
                  )}
                </MarkerContent>
                <MarkerPopup className="w-[300px] rounded-xl border bg-popover p-0 shadow-xl">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium leading-6 line-clamp-3 flex-1">&ldquo;{c.note}&rdquo;</p>
                      {timeHere(c.startedAt) && <Badge variant="secondary" className="shrink-0 font-mono text-[11px]">{timeHere(c.startedAt)}</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground truncate">{c.placeName}</p>

                    <div className="mt-3 flex items-center gap-2 rounded-lg border bg-muted/40 p-2">
                      <Avatar className="size-7">
                        <AvatarImage src={c.userImageUrl} />
                        <AvatarFallback className="text-xs">U</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium leading-none truncate">
                          {c.participants?.length ? `+${c.participants.length} joined` : "Solo session"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">Active now</p>
                      </div>
                    </div>

                    {userId ? (
                      userId !== c.clerkId ? (
                        <div className="mt-3 grid gap-2">
                          <Button size="sm" className="h-8 w-full" onClick={() => handleJoin(c.id as Id<"checkins">, c.clerkId)}>
                            Request to join
                          </Button>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 bg-background"
                              onClick={() => (onCheckin ? onCheckin(c.id) : router.push(`/c/${c.id}`))}
                            >
                              <ExternalLink className="size-3.5" /> Open
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8" onClick={() => handleSayHi(c.clerkId)}>
                              <Hand className="size-3.5" /> Wave
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-3 text-xs text-muted-foreground">This is your check-in.</p>
                      )
                    ) : (
                      <p className="mt-3 rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">Sign in to wave or request to join.</p>
                    )}
                  </div>
                </MarkerPopup>
              </MapMarker>
            );
          })}
        </Map>
      </div>
    </Card>
  );
}
