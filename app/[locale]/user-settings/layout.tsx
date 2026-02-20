"use client";

import { AppSidebar } from "@/components/sidebar/client/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/client/SidebarNavMenuGroup";
import {
  UserIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  NewspaperIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

export default function UserSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const sidebarT = useTranslations("user.settings.sidebar");

  return (
    <AppSidebar
      content={
        <SidebarNavMenuGroup
          className="mt-auto"
          items={
            [
              {
                href: `/user-settings`,
                icon: <UserIcon />,
                label: sidebarT("profile"),
              },
              {
                href: `/user-settings/security`,
                icon: <ShieldCheckIcon />,
                label: sidebarT("security"),
              },
              {
                href: `/user-settings/billing`,
                icon: <CreditCardIcon />,
                label: sidebarT("billing"),
              },
              {
                href: `/user-settings/resume`,
                icon: <NewspaperIcon />,
                label: sidebarT("resume"),
              },
            ].filter(Boolean) as any[]
          }
        />
      }
    >
      {children}
    </AppSidebar>
  );
}
