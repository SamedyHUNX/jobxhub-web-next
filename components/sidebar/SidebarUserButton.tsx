"use client";

import { useProfile } from "@/hooks/use-profile";
import { SidebarUserButtonClient } from "./_SidebarUserButtonClient";
import { useLocale } from "next-intl";

export const SidebarUserButton = () => {
  const {
    profile: currentUser,
    isLoading: isFetchingCurrentUser,
    isError: currentUserError,
  } = useProfile();
  const locale = useLocale();

  // Handle loading state
  if (isFetchingCurrentUser) {
    return <div className="text-center">Loading...</div>;
  }

  // Handle error state
  if (currentUserError) {
    return <div className="text-center">Error loading profile</div>;
  }

  // Handle undefined profile (no token or failed to load)
  if (!currentUser) {
    return null;
  }

  return (
    <SidebarUserButtonClient
      user={currentUser}
      redirectPath={`/${locale}/user-profile`}
    />
  );
};
