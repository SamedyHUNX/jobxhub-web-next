"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../../ui/sidebar";
import { CSSProperties, ReactNode } from "react";
import BrandLogo from "../../BrandLogo";
import { SignedIn } from "../../AuthStatus";
import { NavBar } from "../../Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import AppSidebarClient from "./_AppSidebarClient";

export const AppSidebar = ({
  content,
  children,
  footerButton,
}: {
  content?: ReactNode;
  children: ReactNode;
  footerButton?: ReactNode;
}) => {
  const isMobile = useIsMobile();
  return (
    <SidebarProvider
      className="overflow-y-hidden"
      style={{ "--sidebar-width": "20rem" } as CSSProperties}
    >
      <AppSidebarClient>
        <Sidebar
          collapsible="icon"
          className="overflow-hidden"
          style={{ "--sidebar-width": "20rem" } as CSSProperties}
        >
          <SidebarHeader className="flex-row h-12 mt-2 ">
            <SidebarTrigger className="mt-2" />
            <BrandLogo />
          </SidebarHeader>
          <SidebarContent>{content}</SidebarContent>
          <SignedIn>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>{footerButton}</SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>
        <main className="flex-1 w-full">
          {!isMobile && <NavBar />}
          {children}
        </main>
      </AppSidebarClient>
    </SidebarProvider>
  );
};
