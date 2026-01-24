import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import { ReactNode } from "react";
import AppSidebarClient from "./_AppSidebarClient";
import BrandLogo from "../BrandLogo";
import { SignedIn } from "../AuthStatus";
import { NavBar } from "../Navbar";

export const AppSidebar = ({
  content,
  children,
  footerButton,
  showNavBar = true,
}: {
  content?: ReactNode;
  children: ReactNode;
  footerButton?: ReactNode;
  showNavBar?: boolean;
}) => {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row h-12 mt-2">
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
          {showNavBar && <NavBar />}
          {children}
        </main>
      </AppSidebarClient>
    </SidebarProvider>
  );
};
