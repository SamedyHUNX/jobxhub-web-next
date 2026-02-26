"use client";

import { NotificationsForm } from "@/components/users/NotificationsForm";
import PageLoader from "@/components/PageLoader";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/use-profile";
import { Suspense, useEffect, useState } from "react";

export default function NotificationsPage() {
  const { user: currentUser, getMyNotificationSettings } = useProfile();
  const [notificationSettings, setNotificationSettings] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      if (currentUser?.id) {
        const notifications = await getMyNotificationSettings();
        setNotificationSettings(notifications);
      }
    };
    fetchNotifications();
  }, [currentUser?.id, getMyNotificationSettings]);
  if (!currentUser) return null;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<PageLoader />}>
            <NotificationsForm notificationSettings={notificationSettings} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
