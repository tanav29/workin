"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { dark } from "@clerk/themes";

export default function AuthComp() {
  return (
    <>
      <Authenticated>
        <UserButton
          appearance={{
            theme: dark,
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
