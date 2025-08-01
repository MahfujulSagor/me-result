"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavAdmin } from "./nav-admin";
import { useAppwrite } from "@/context/appwrite-context";
import Image from "next/image";
import ME from "@/public/me-logo.png";
import { NavMain } from "./nav-main";
import { BookOpen, LayoutDashboard } from "lucide-react";

const data = {
  navMain: [
    {
      title: "Results",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Publish",
          url: "/admin/results/publish",
        },
        {
          title: "Edit",
          url: "/admin/results/edit",
        },
      ],
    },
  ],
  navDashboard: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Statistics",
          url: "/admin/dashboard",
        },
      ],
    },
  ],
};

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
        <NavMain items={data.navDashboard} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavAdmin user={{ id: adminId, role: adminRole }} />
      </SidebarFooter>
    </Sidebar>
  );
}
