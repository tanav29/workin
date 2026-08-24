"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, ArrowLeft, Loader2, Hand, Users, Copy, Check } from "lucide-react";

export default function SharePage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = React.use(params);
  const data = useQuery(api.checkins.getById, { id: shareId });
  const currentUser = useQuery(api.users.current);
  const sayHello = useMutation(api.users.sayHello);
  const [copied, setCopied] = React.useState(false);

  if (data === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!data?.checkin) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <h1 className="text-lg font-semibold tracking-tight">Not found</h1>
        <p className="text-sm text-muted-foreground">This check-in expired or is private. Sessions expire after 6 hours.</p>
        <Button asChild size="sm" className="mt-2">
          <Link href="/nearby">Back to map</Link>
        </Button>
      </div>
    );
  }

  const { checkin } = data;
  const isSelf = currentUser?.clerkId === checkin.clerkId;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8">
      <Link href="/nearby" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back
      </Link>

      <Card className="mt-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant={checkin.active ? "default" : "secondary"} className={checkin.active ? "bg-emerald-500 text-white" : ""}>
              {checkin.active ? "Live" : "Ended"}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">{new Date(checkin.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Avatar className="size-12 border">
              <AvatarImage src={checkin.userImageUrl} />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="text-base leading-none">Check-in</CardTitle>
              <CardDescription className="font-mono text-xs truncate">{shareId}</CardDescription>
            </div>
            <Button variant="outline" size="icon" className="ml-auto size-8 bg-background" onClick={handleCopy}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="text-sm font-medium leading-6">&ldquo;{checkin.note}&rdquo;</p>
            {checkin.status && <p className="mt-1 text-xs text-muted-foreground">{checkin.status}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-3">
              <p className="text-[11px] font-medium tracking-widest text-muted-foreground">LAT</p>
              <p className="font-mono text-sm">{checkin.lat.toFixed(5)}</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-[11px] font-medium tracking-widest text-muted-foreground">LNG</p>
              <p className="font-mono text-sm">{checkin.lng.toFixed(5)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" /> {checkin.placeName || "Unknown place"}
          </div>
          {checkin.participants?.length ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" /> {checkin.participants.length} joined
            </div>
          ) : null}

          {currentUser && !isSelf ? (
            <Button
              onClick={async () => {
                try {
                  await sayHello({ clerkId: checkin.clerkId });
                  toast.success("Waved 👋");
                } catch {
                  toast.error("Failed");
                }
              }}
              className="w-full"
            >
              <Hand className="size-4" /> Wave hello
            </Button>
          ) : !currentUser ? (
            <p className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">Sign in to wave.</p>
          ) : null}

          <div className="flex items-center justify-center gap-1.5 border-t pt-4 text-xs text-muted-foreground">
            <Clock className="size-3.5" /> Expires after 6 hours
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
