"use client";

import PageLoader from "@/components/PageLoader";
import { Card, CardContent } from "@/components/ui/card";
import { NotificationsForm } from "@/components/users/NotificationsForm";
import { useOrgs } from "@/hooks/use-orgs";
import { useProfile } from "@/hooks/use-profile";
import { Suspense, useEffect, useState } from "react";

export default function OrgByIdMembersPage() {
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
  const { getOrgUserNotificationSettingsMutation } = useOrgs();
  const [notificationSettings, setNotificationSettings] = useState(null);

  useEffect(() => {
    const notifications = getOrgUserNotificationSettingsMutation.mutate(orgId);
    setNotificationSettings(notificationSettings);
  }, []);

  return (
    <NotificationsForm
      notificationSettings={notificationSettings}
      orgId={orgId}
    />
  );
}
