"use client";

import Link from "next/link";
import AuthComp from "@/components/app/auth-comp";
import { usePathname } from "next/navigation";
import { NotificationsMenu } from "@/components/app/notifications-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/nearby", label: "Nearby" },
  { href: "/settings", label: "Settings" },
] as const;

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto max-w-6xl flex h-14 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="hidden md:flex items-center gap-2">
            <span className="text-[15px] font-semibold tracking-tight">cowork</span>
          </Link>

          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm transition-colors hover:text-foreground",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex h-full items-center justify-center gap-2">
          <NotificationsMenu />
          <AuthComp />
        </div>
      </div>
    </header>
  );
}
