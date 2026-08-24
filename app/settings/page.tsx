"use client";

import * as React from "react";
import Link from "next/link";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignInButton } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ExternalLink, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function initials(name?: string) {
  const n = (name ?? "").trim();
  if (!n) return "?";
  const p = n.split(/\s+/).filter(Boolean);
  return ((p[0]?.[0] ?? "") + (p.length > 1 ? p[p.length - 1]?.[0] ?? "" : "")).toUpperCase();
}

export default function ProfileSettingsPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const user = useQuery(api.users.current);
  const myActive = useQuery(api.checkins.getMyActiveCheckin);
  const updateProfile = useMutation(api.users.updateProfile);
  const stopCheckin = useMutation(api.checkins.stop);
  const ensureUser = useMutation(api.users.ensure);

  const [bio, setBio] = React.useState("");
  const [links, setLinks] = React.useState("");
  const [defaultVisibility, setDefaultVisibility] = React.useState("public");
  const [defaultFuzzKm, setDefaultFuzzKm] = React.useState("0");
  const [defaultStatus, setDefaultStatus] = React.useState("Open to chat");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isStopping, setIsStopping] = React.useState(false);

  // Fix: webhook may not have created user doc yet — auto-create from Clerk identity
  React.useEffect(() => {
    if (isAuthenticated && user === null) {
      ensureUser().catch(() => {});
    }
  }, [isAuthenticated, user, ensureUser]);

  React.useEffect(() => {
    if (!user) return;
    setBio(user.bio ?? "");
    setLinks(Array.isArray(user.links) ? user.links.join(", ") : "");
    if (user.defaultVisibility) setDefaultVisibility(user.defaultVisibility);
    if (user.defaultFuzzKm !== undefined) setDefaultFuzzKm(String(user.defaultFuzzKm));
    if (user.defaultStatus) setDefaultStatus(user.defaultStatus);
  }, [user]);

  async function onSave() {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProfile({
        bio: bio.trim() || undefined,
        links: links.split(",").map((s) => s.trim()).filter(Boolean),
        defaultVisibility,
        defaultFuzzKm: Number.isFinite(Number.parseFloat(defaultFuzzKm)) ? Math.max(0, Number.parseFloat(defaultFuzzKm)) : undefined,
        defaultStatus: defaultStatus.trim() || undefined,
      });
      toast.success("Saved");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setIsSaving(false);
    }
  }
  async function onStop() {
    if (!myActive) return;
    setIsStopping(true);
    try {
      await stopCheckin();
      toast.success("Session ended");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setIsStopping(false);
    }
  }

  // Auth is still loading (Clerk -> Convex token exchange) — don't flash "Please sign in"
  if (isAuthLoading || user === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Profile, defaults and active session.</p>
        <Card className="mt-6">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-sm text-muted-foreground">Please sign in to view settings.</p>
            <SignInButton mode="modal">
              <Button size="sm">Sign in</Button>
            </SignInButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated but user doc missing — webhook hasn't fired yet, ensure() is running
  if (user === null) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span>Setting up your profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">Profile, defaults and active session.</p>
          </div>
          <Button render={<Link href={`/p/${user.clerkId}`} />} variant="outline" size="sm" className="w-fit bg-background">
            Public profile <ExternalLink className="size-3.5" />
          </Button>
        </div>

        {myActive && (
          <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-2 animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  Active session
                </CardTitle>
                <Badge variant="secondary" className="font-mono text-xs bg-background">
                  {timeAgo(myActive.startedAt)}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1.5 text-xs">
                <MapPin className="size-3.5" /> {myActive.placeName || "Unknown place"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {myActive.note && <p className="text-sm leading-6">&ldquo;{myActive.note}&rdquo;</p>}
              <div className="mt-3 flex justify-end">
                <Button variant="outline" size="sm" className="h-8 bg-background" onClick={onStop} disabled={isStopping}>
                  {isStopping ? <Loader2 className="size-4 animate-spin" /> : null} Stop session
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Profile</CardTitle>
            <CardDescription>Visible on your public page and check-ins.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border">
                <AvatarImage src={user.imageUrl} alt={user.name} />
                <AvatarFallback>{initials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Default status</Label>
                <Select value={defaultStatus} onValueChange={(value) => value !== null && setDefaultStatus(value)}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open to chat">Open to chat</SelectItem>
                    <SelectItem value="Deep work">Deep work</SelectItem>
                    <SelectItem value="Heads down">Heads down</SelectItem>
                    <SelectItem value="Pairing">Pairing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Default visibility</Label>
                <Select value={defaultVisibility} onValueChange={(value) => value !== null && setDefaultVisibility(value)}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="nearby">Nearby only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fuzz" className="text-xs">Default fuzz (km)</Label>
              <Input id="fuzz" type="number" min="0" step="0.1" value={defaultFuzzKm} onChange={(e) => setDefaultFuzzKm(e.target.value)} className="h-9 max-w-[200px]" />
              <p className="text-xs text-muted-foreground">Adds a random offset to your pin.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs">Bio</Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What are you building?" className="min-h-[84px] resize-none text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="links" className="text-xs">Links</Label>
              <Input id="links" value={links} onChange={(e) => setLinks(e.target.value)} placeholder="github.com/..., x.com/..." className="h-9" />
              <p className="text-xs text-muted-foreground">Comma separated.</p>
            </div>
            <div className="flex justify-end">
              <Button onClick={onSave} disabled={isSaving} className="h-9">
                {isSaving && <Loader2 className="size-4 animate-spin" />} Save changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
