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

export function NavUser({
  user,
}: {
  user: {
    student_id: string;
    academic_session: string;
  };
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center min-w-56 min-h-12 gap-2 px-3 py-2 text-sm hover:bg-muted rounded-lg"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg">ME</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-medium leading-none">
              {user.student_id}
            </p>
            <p className="text-xs text-muted-foreground">
              {user.academic_session}
            </p>
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
              <p className="text-sm font-medium leading-none">
                {user.student_id}
              </p>
              <p className="text-xs text-muted-foreground">
                {user.academic_session}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
