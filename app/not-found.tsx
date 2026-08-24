import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <p className="rounded-full border bg-muted px-3 py-1 text-xs font-medium">404</p>
      <h1 className="text-lg font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">The page you’re looking for doesn’t exist or was moved.</p>
      <Button render={<Link href="/" />} className="mt-2 h-9">
        Go home
      </Button>
    </div>
  );
}
