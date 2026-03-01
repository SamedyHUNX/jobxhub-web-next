"use client";

import { useCustomForm } from "@/hooks/use-custom-form";
import {
  OrgUserNotificationSettings,
  orgUserNotificationSettingsSchema,
} from "@/schemas";
import { useTranslations } from "next-intl";
import { FormField } from "../FormField";
import { Switch } from "../ui/switch";
import { useState } from "react";
import SubmitButton from "../SubmitButton";
import { useOrgs } from "@/hooks/use-orgs";

export function NotificationsForm({
  orgId,
  notificationSettings,
}: {
  orgId: string;
  notificationSettings?: Partial<OrgUserNotificationSettings>;
}) {
  const validationT = useTranslations("validations");
  const orgUserNotificationSettingsVali =
    orgUserNotificationSettingsSchema(validationT);

  const [isSaving, setIsSaving] = useState(false);
  const { updateOrgUserNotificationSettingsMutation } = useOrgs();

  const defaultValues: OrgUserNotificationSettings = {
    newApplicationEmailNotifications:
      notificationSettings?.newApplicationEmailNotifications ?? false,
    minimumRating: notificationSettings?.minimumRating ?? 0,
  };

  const notificationsForm = useCustomForm<OrgUserNotificationSettings>({
    validationSchema: orgUserNotificationSettingsVali,
    defaultValues,
    onSubmit: async (data: OrgUserNotificationSettings) => {
      setIsSaving(true);
      try {
        await updateOrgUserNotificationSettingsMutation.mutateAsync({
          orgId,
          data,
        });
      } catch {
        console.error(
          "Failed to save notification settings. Please try again.",
        );
      } finally {
        setIsSaving(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        notificationsForm.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* New Application Email Notifications toggle */}
      <notificationsForm.Field
        name="newApplicationEmailNotifications"
        validators={{
          onChange: ({ value }) =>
            orgUserNotificationSettingsVali.shape.newApplicationEmailNotifications.safeParse(
              value,
            ).success
              ? undefined
              : orgUserNotificationSettingsVali.shape.newApplicationEmailNotifications.safeParse(
                  value,
                ).error?.issues[0].message,
        }}
      >
        {(field) => (
          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="space-y-0.5">
              <label
                htmlFor="newApplicationEmailNotifications"
                className="text-sm font-medium leading-none"
              >
                New Application Email Notifications
              </label>
              <p className="text-sm text-muted-foreground">
                Receive emails when new applications are submitted
              </p>
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
            <Switch
              id="newApplicationEmailNotifications"
              checked={field.state.value}
              onCheckedChange={field.handleChange}
            />
          </div>
        )}
      </notificationsForm.Field>

      {/* Minimum Rating */}
      <FormField
        form={notificationsForm}
        name="minimumRating"
        label="Minimum Rating"
        description="Only receive notifications for applications with a rating equal to or above this value."
        validator={(value) => {
          const result =
            orgUserNotificationSettingsVali.shape.minimumRating.safeParse(
              value,
            );
          return result.success ? undefined : result.error.issues[0].message;
        }}
        render={(field) => (
          <input
            id="minimumRating"
            type="number"
            value={field.state.value}
            onChange={(e) => field.handleChange(Number(e.target.value))}
            onBlur={field.handleBlur}
            placeholder="e.g. 3"
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      />

      {/* Save button */}
      <div className="flex justify-end">
        <SubmitButton isSubmitting={isSaving} buttonText="Save Preferences" />
      </div>
    </form>
  );
}
