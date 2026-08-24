"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink, Github, Mail, Globe, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfile({ params }: { params: Promise<{ clerkId: string }> }) {
  const { clerkId } = React.use(params);
  const user = useQuery(api.users.getByClerkId, { clerkId });

  if (user === undefined) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (user === null) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <p className="text-sm font-medium">User not found</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Home
      </Link>

      <Card className="mt-6 overflow-hidden">
        <div className="h-20 bg-muted" />
        <CardContent className="p-6">
          <div className="-mt-12 flex items-end gap-4">
            <Avatar className="size-20 border-4 border-background shadow-sm">
              <AvatarImage src={user.imageUrl} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="pb-1">
              <h1 className="text-lg font-semibold tracking-tight leading-none">{user.name}</h1>
              {user.email && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="size-3.5" /> {user.email}
                </p>
              )}
            </div>
          </div>

          {user.bio && <p className="mt-6 whitespace-pre-wrap text-sm leading-6">{user.bio}</p>}

          {user.links && user.links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {user.links.map((link, i) => {
                const url = link.startsWith("http") ? link : `https://${link}`;
                const isGithub = link.includes("github.com");
                let hostname = link;
                try {
                  hostname = new URL(url).hostname.replace("www.", "");
                } catch {}
                return (
                  <Button key={i} variant="outline" size="sm" asChild className="h-7 gap-1.5 bg-background rounded-full">
                    <a href={url} target="_blank" rel="noreferrer">
                      {isGithub ? <Github className="size-3.5" /> : <Globe className="size-3.5" />}
                      <span className="text-xs">{hostname}</span>
                      <ExternalLink className="size-3 opacity-50" />
                    </a>
                  </Button>
                );
              })}
            </div>
          )}

          <div className="mt-6 flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
            <span className="font-mono">{user.checkinsCount} check-ins</span>
            <span>·</span>
            <span>Joined {new Date(user.updatedAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
