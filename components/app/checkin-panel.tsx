"use client";

import * as React from "react";
import Link from "next/link";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MapPin, ArrowRight, XCircle, Loader2, Share2, ChevronDown, ChevronUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type CreateResponse = { id: string };

export function CheckinPanel({ coords, defaultOpen = false }: { coords: { lat: number; lng: number }; defaultOpen?: boolean }) {
  const { isLoaded, userId } = useAuth();
  const activeCheckin = useQuery(api.checkins.getMyActiveCheckin);
  const user = useQuery(api.users.current);
  const create = useAction(api.checkins.createCheckin);
  const end = useMutation(api.checkins.stop);

  const [note, setNote] = React.useState("");
  const [status, setStatus] = React.useState("Open to chat");
  const [visibility, setVisibility] = React.useState("public");
  const [fuzzKm, setFuzzKm] = React.useState("0");
  const [shareId, setShareId] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [open, setOpen] = React.useState(defaultOpen);

  // auto-open when user has active checkin
  React.useEffect(() => {
    setShareId(activeCheckin?._id ?? null);
    if (activeCheckin?._id) setOpen(true);
  }, [activeCheckin]);

  React.useEffect(() => {
    if (!user) return;
    if (user.defaultStatus) setStatus(user.defaultStatus);
    if (user.defaultVisibility) setVisibility(user.defaultVisibility);
    if (user.defaultFuzzKm !== undefined) setFuzzKm(String(user.defaultFuzzKm));
  }, [user]);

  const canUse = isLoaded && !!userId;

  async function onCreate() {
    if (!canUse) {
      toast.error("Please sign in to check in.");
      return;
    }
    setCreating(true);
    try {
      const fuzzValue = Number.parseFloat(fuzzKm);
      const res = (await create({
        lat: coords.lat,
        lng: coords.lng,
        note: note.trim() || "Working here",
        status: status.trim() || undefined,
        visibility,
        fuzzKm: Number.isFinite(fuzzValue) ? Math.max(0, fuzzValue) : undefined,
      })) as CreateResponse;
      setShareId(res.id);
      toast.success("Checked in — you’re live on the map.");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to check in");
    } finally {
      setCreating(false);
    }
  }

  async function onEnd() {
    if (!canUse) return;
    try {
      await end();
      setShareId(null);
      toast.success("Session ended");
    } catch {
      toast.error("Failed to end check-in");
    }
  }

  return (
    <div className="w-full rounded-xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition-colors"
      >
        <div className="min-w-0 flex items-center gap-3">
          <div className={cn("size-2 rounded-full shrink-0", shareId ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground")} />
          <div className="min-w-0">
            <p className="text-sm font-medium leading-none tracking-tight">{shareId ? "You’re live" : "Check in"}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground truncate">
              {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)} {shareId ? "· visible" : ""}
            </p>
          </div>
        </div>
        <span className="ml-3 flex items-center gap-2">
          <span
            className={cn(
              "hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
              shareId ? "bg-emerald-500 text-white border-emerald-600" : "bg-muted text-muted-foreground"
            )}
          >
            {shareId ? "Live" : "Ready"}
          </span>
          <span className="grid size-7 place-items-center rounded-md border bg-background">
            {open ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
          </span>
        </span>
      </button>

      {!open && (
        <div className="px-4 pb-3 flex items-center justify-between border-t bg-muted/20">
          <p className="text-xs text-muted-foreground">
            {shareId ? "Tap to manage session" : "Tap to check in near this location"}
          </p>
          <Minus className="size-3 text-muted-foreground" />
        </div>
      )}

      {open && (
        <div className="border-t p-4 animate-in fade-in-0">
          {!shareId ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="note" className="text-xs font-medium">
                  What are you working on?
                </Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Shipping a new feature, deep work, open to pair…"
                  disabled={!canUse}
                  className="min-h-[72px] resize-none text-sm"
                  maxLength={120}
                />
                <p className="text-[11px] text-muted-foreground text-right">{note.length}/120</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <Select value={status} onValueChange={(value) => value !== null && setStatus(value)} disabled={!canUse}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open to chat">Open to chat</SelectItem>
                      <SelectItem value="Deep work">Deep work</SelectItem>
                      <SelectItem value="Heads down">Heads down</SelectItem>
                      <SelectItem value="Pairing">Pairing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Visibility</Label>
                  <Select value={visibility} onValueChange={(value) => value !== null && setVisibility(value)} disabled={!canUse}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="nearby">Nearby only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fuzz" className="text-xs">
                  Fuzz <span className="text-muted-foreground font-normal">— privacy offset (km)</span>
                </Label>
                <Input
                  id="fuzz"
                  type="number"
                  min="0"
                  step="0.1"
                  value={fuzzKm}
                  onChange={(e) => setFuzzKm(e.target.value)}
                  disabled={!canUse}
                  className="h-9"
                />
              </div>

              {!canUse && <p className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">Sign in to check in and appear on the map.</p>}

              <Button onClick={onCreate} disabled={!canUse || creating} className="w-full h-9">
                {creating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Checking in…
                  </>
                ) : (
                  <>
                    Check in <ArrowRight className="size-4 opacity-70" />
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-3 rounded-lg border bg-muted/40 p-3">
                <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500 text-white shrink-0">
                  <MapPin className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-none">You’re live</p>
                  <p className="mt-1 text-xs text-muted-foreground">Visible to others within your radius.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" render={<Link href={`/c/${shareId}`} />} className="h-9 bg-background">
                  <Share2 className="size-4" /> Share
                </Button>
                <Button variant="outline" onClick={onEnd} className="h-9 text-destructive hover:text-destructive">
                  <XCircle className="size-4" /> End
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
