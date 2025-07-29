"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useAppwrite } from "@/context/appwrite-context";
import { Skeleton } from "./ui/skeleton";
import { useSidebar } from "./ui/sidebar";

export function NavAdmin({
  user,
}: {
  user: {
    id: string | null;
    role: string | null;
  };
}) {
  const { logout } = useAppwrite();
  const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="shadow-sm shadow-blue-200 flex items-center sm:min-w-56 min-w-46 min-h-12 gap-2 px-3 py-2 text-sm hover:bg-muted rounded-lg"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg">ME</AvatarFallback>
          </Avatar>
          <div className="text-left">
            {user.id ? (
              <p className="text-sm font-medium leading-none">{user.id}</p>
            ) : (
              <Skeleton className="h-3 sm:w-24 w-20 bg-muted-foreground rounded" />
            )}

            {user.role ? (
              <p className="text-xs text-muted-foreground">{user.role}</p>
            ) : (
              <Skeleton className="h-2 w-16 bg-muted-foreground mt-0.5 rounded" />
            )}
          </div>
          <ChevronsUpDown className="size-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-64 rounded-lg"
        side={isMobile ? "top" : "right"}
        align="end"
        sideOffset={6}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-3 py-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">ME</AvatarFallback>
            </Avatar>
            <div>
              {user?.id ? (
                <p className="text-sm font-medium leading-none">{user.id}</p>
              ) : (
                <Skeleton className="h-3 sm:w-24 w-20 bg-muted-foreground rounded" />
              )}
              {user?.role ? (
                <p className="text-xs text-muted-foreground">{user.role}</p>
              ) : (
                <Skeleton className="h-2 w-16 bg-muted-foreground mt-0.5 rounded" />
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={logout} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
