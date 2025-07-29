"use client";
import { useSidebar } from "@/components/ui/sidebar";

export const AdminShell = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { isMobile } = useSidebar();

  if (isMobile) {
    return (
      <div className="relative z-50 w-full min-h-screen flex items-center justify-center text-center p-4">
        <p className="text-xl font-semibold text-red-600">
          Admin panel is only accessible on desktop devices.
        </p>
      </div>
    );
  }
  return <main>{children}</main>;
};
