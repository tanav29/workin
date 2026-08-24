"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ConvexNotice() {

  return (
    <Card className="mb-6 border-border/60 bg-card/40 p-5">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-medium">Convex not configured</p>
          <p className="text-sm text-muted-foreground">
            Run Convex locally to generate `NEXT_PUBLIC_CONVEX_URL` in `.env.local`.
          </p>
        </div>
        <div>
          <Button
            render={<a href="https://docs.convex.dev/quickstart/nextjs" target="_blank" rel="noreferrer" />}
            variant="secondary"
          >
            Convex Next.js quickstart
          </Button>
        </div>
      </div>
    </Card>
  );
}
