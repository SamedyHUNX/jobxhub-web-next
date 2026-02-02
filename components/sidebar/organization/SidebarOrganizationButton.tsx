"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ArrowLeftRightIcon,
  Building2,
  ChevronsUpDown,
  CreditCard,
  UserRoundCogIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { BackHomeButton } from "@/components/BackHomeButton";
import { Organization, User } from "@/types";

export default function SidebarOrganizationButton({
  currentOrg,
  currentUser,
}: {
  currentOrg: Organization | undefined;
  currentUser: User | null;
}) {
  // Handle no selected organization
  if (!currentUser || !currentOrg) {
    return <BackHomeButton variant="destructive" />;
  }

  return (
    <SidebarOrganizationButtonClient
      orgName={currentOrg?.orgName ?? null}
      imageUrl={currentOrg?.imageUrl ?? null}
      slug={currentOrg?.slug ?? null}
    />
  );
}

export function SidebarOrganizationButtonClient({
  orgName,
  imageUrl,
  slug,
}: {
  orgName: string | null;
  imageUrl: string | null;
  slug: string | null;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  const openOrganizationProfile = () => {
    setOpenMobile(false);
    router.push("/employer/orgs/select");
  };

  return (
    <SidebarMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size={"lg"}
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <OrganizationInfo
              orgName={orgName}
              imageUrl={imageUrl}
              slug={slug}
            />
            <ChevronsUpDown className="ml-auto group-data-[state=collapsed]:hidden" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={4}
          align="end"
          side={isMobile ? "bottom" : "right"}
          className="min-w-64 max-w-80"
        >
          <DropdownMenuLabel>
            <OrganizationInfo
              orgName={orgName}
              imageUrl={imageUrl}
              slug={slug}
            />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openOrganizationProfile}>
            <Building2 className="mr-1" /> Manage Organization
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={"/employer/user-settings"}>
              <UserRoundCogIcon className="mr-1" />
              User Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={"/employer/pricing"}>
              <CreditCard className="mr-1" />
              Change Plan
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={"/employer/organizations/select"}>
              <ArrowLeftRightIcon className="mr-1" />
              Switch Organizations
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenu>
  );
}

function OrganizationInfo({
  orgName,
  imageUrl,
  slug,
}: {
  orgName: string | null;
  imageUrl: string | null;
  slug: string | null;
}) {
  const displayName = orgName || "Organization";

  const nameInitial = displayName
    .split(" ")
    .slice(0, 2)
    .map((str) => str[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <Avatar className="rounded-lg size-8">
        <AvatarImage src={imageUrl || undefined} alt={displayName} />
        <AvatarFallback className="uppercase bg-primary text-primary-foreground">
          {nameInitial}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden">
        <span className="truncate text-sm font-semibold">{displayName}</span>
        <span className="truncate text-xs">{slug}</span>
      </div>
    </div>
  );
}
