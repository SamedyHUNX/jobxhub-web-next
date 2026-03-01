"use client";

import { NotificationsForm } from "@/components/organizations/NotificationsForm";
import PageLoader from "@/components/PageLoader";
import { Card, CardContent } from "@/components/ui/card";
import { useOrgs } from "@/hooks/use-orgs";
import { useProfile } from "@/hooks/use-profile";
import { Suspense } from "react";

export default function OrgMembersPage() {
  const { user: currentUser } = useProfile();
  const { selectedOrgId } = useOrgs();

  if (!currentUser || !selectedOrgId) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<PageLoader />}>
            <SuspendedForm orgId={selectedOrgId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function SuspendedForm({ orgId }: { orgId: string }) {
  const { getOrgUserNotificationSettingsQuery } = useOrgs();
  const { data: notificationSettings } =
    getOrgUserNotificationSettingsQuery(orgId);

  return (
    <NotificationsForm
      orgId={orgId}
      notificationSettings={notificationSettings}
    />
  );
}
