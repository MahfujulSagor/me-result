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

export function NavUser({
  user,
}: {
  user: {
    student_id: string | null;
    academic_session: string | null;
  };
}) {
  const { logout } = useAppwrite();

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
            {user.student_id ? (
              <p className="text-sm font-medium leading-none">
                {user.student_id}
              </p>
            ) : (
              <Skeleton className="h-3 sm:w-24 w-20 bg-muted-foreground rounded" />
            )}

            {user.academic_session ? (
              <p className="text-xs text-muted-foreground">
                {user.academic_session}
              </p>
            ) : (
              <Skeleton className="h-2 w-16 bg-muted-foreground mt-0.5 rounded" />
            )}
          </div>
          <ChevronsUpDown className="size-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-64 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={6}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-3 py-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">ID</AvatarFallback>
            </Avatar>
            <div>
              {user?.student_id ? (
                <p className="text-sm font-medium leading-none">
                  {user.student_id}
                </p>
              ) : (
                <Skeleton className="h-3 sm:w-24 w-20 bg-muted-foreground rounded" />
              )}
              {user?.academic_session ? (
                <p className="text-xs text-muted-foreground">
                  {user.academic_session}
                </p>
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
