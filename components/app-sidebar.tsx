"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavAdmin } from "./nav-admin";
import { useAppwrite } from "@/context/appwrite-context";
import Image from "next/image";
import ME from "@/public/me-logo.png";

export function AppSidebar() {
  const { adminId, adminRole } = useAppwrite();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src={ME}
                    alt="me_logo"
                    width={32}
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Mechanical Engineering</span>
                  <span className="text-xs">EST. 2021</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <NavAdmin user={{ id: adminId, role: adminRole }} />
      </SidebarFooter>
    </Sidebar>
  );
}
