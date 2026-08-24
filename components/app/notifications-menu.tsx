"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export function NotificationsMenu() {
  const notifications = useQuery(api.notifications.getMyNotifications);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const clearAll = useMutation(api.notifications.clearAll);
  const acceptJoinRequest = useMutation(api.notifications.acceptJoinRequest);
  const declineJoinRequest = useMutation(api.notifications.declineJoinRequest);

  const unreadCount = notifications?.length ?? 0;

  const handleClearAll = async () => {
    try {
      await clearAll();
      toast.success("Cleared");
    } catch {
      toast.error("Failed to clear");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="mx-2">
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-semibold tracking-tight">Notifications</span>
          {unreadCount > 0 ? (
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={handleClearAll}>
              Clear all
            </Button>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-[380px] overflow-auto">
          {notifications === undefined ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-medium">No new notifications</p>
              <p className="mt-1 text-xs text-muted-foreground">Waves and join requests will appear here.</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  className="flex gap-3 p-3 hover:bg-muted/50"
                >
                  <Avatar className="size-8 shrink-0">
                    <AvatarImage src={n.imagePayloadUrl} />
                    <AvatarFallback className="text-xs">U</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {n.type === "say-hello" ? "Waved hello 👋" : n.type === "join-request" ? "Wants to join" : "Notification"}
                    </p>
                    <p className="text-xs leading-5 text-muted-foreground line-clamp-2">{n.action}</p>
                    <p className="text-[11px] text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                    {n.type === "join-request" ? (
                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          className="h-7 px-3 text-xs"
                          onClick={async () => {
                            try {
                              await acceptJoinRequest({ notificationId: n._id });
                              toast.success("Accepted");
                            } catch {
                              toast.error("Failed");
                            }
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-3 text-xs bg-background"
                          onClick={async () => {
                            try {
                              await declineJoinRequest({ notificationId: n._id });
                              toast.success("Declined");
                            } catch {
                              toast.error("Failed");
                            }
                          }}
                        >
                          Decline
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs -ml-2"
                        onClick={async () => {
                          try {
                            await markAsRead({ notificationId: n._id as Id<"notifications"> });
                          } catch {
                            toast.error("Failed");
                          }
                        }}
                      >
                        Mark read
                      </Button>
                    )}
                  </div>
                  {n.type !== "join-request" && <span className="mt-1 size-1.5 shrink-0 rounded-full bg-blue-500" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
