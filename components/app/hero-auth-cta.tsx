"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { MapPin, ArrowRight, LogIn } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroAuthCta() {
  return (
    <>
      <AuthLoading>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Skeleton className="h-10 w-40 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </AuthLoading>

      <Authenticated>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="h-10 px-6">
            <Link href="/nearby">
              <MapPin className="size-4" />
              Explore nearby
              <ArrowRight className="size-4 opacity-60" />
            </Link>
          </Button>
        </div>
      </Authenticated>

      <Unauthenticated>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <SignInButton mode="modal">
            <Button size="lg" className="h-10 w-full sm:w-auto px-6">
              <LogIn className="size-4" />
              Sign in to start
              <ArrowRight className="size-4 opacity-60" />
            </Button>
          </SignInButton>
          <Button asChild variant="outline" size="lg" className="h-10 w-full sm:w-auto px-6 bg-background">
            <Link href="/nearby">
              <MapPin className="size-4" />
              Explore nearby
            </Link>
          </Button>
        </div>
      </Unauthenticated>
    </>
  );
}
