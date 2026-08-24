"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthComp() {
  return (
    <>
      <Authenticated>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-7 ring-1 ring-border",
            },
          }}
        />
      </Authenticated>
      <Unauthenticated>
        <SignInButton mode="modal">
          <Button size="sm" className="h-8 rounded-md px-3 text-sm font-medium">
            Sign in
          </Button>
        </SignInButton>
      </Unauthenticated>
    </>
  );
}
