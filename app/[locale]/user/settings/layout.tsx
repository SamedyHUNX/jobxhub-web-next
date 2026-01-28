"use client";

import { AppSidebar } from "@/components/sidebar/AppSidebar";
import SidebarNavMenuGroup from "@/components/sidebar/SidebarNavMenuGroup";
import { useProfile } from "@/hooks/use-profile";
import { UserIcon, ShieldCheckIcon, CreditCardIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

export default function UserSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { profile: currentUser } = useProfile();
  const sidebarT = useTranslations("user.settings.sidebar");

  return (
    <AppSidebar
      content={
        <SidebarNavMenuGroup
          className="mt-auto"
          items={
            [
              {
                href: `/user/settings`,
                icon: <UserIcon />,
                label: sidebarT("profile"),
              },
              {
                href: `/user/settings/security`,
                icon: <ShieldCheckIcon />,
                label: sidebarT("security"),
              },
              {
                href: `/user/settings/billing`,
                icon: <CreditCardIcon />,
                label: sidebarT("billing"),
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
