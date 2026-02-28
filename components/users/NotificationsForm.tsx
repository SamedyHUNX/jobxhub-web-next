"use client";

import { useCustomForm } from "@/hooks/use-custom-form";
import {
  UserNotificationSettings,
  userNotificationSettingsSchema,
} from "@/schemas";
import { useTranslations } from "next-intl";
import { FormField } from "../FormField";
import { Switch } from "../ui/switch";
import { useStore } from "@tanstack/react-form";
import { useState } from "react";
import SubmitButton from "../SubmitButton";
import { useProfile } from "@/hooks/use-profile";

export function NotificationsForm({
  notificationSettings,
}: {
  notificationSettings?: Partial<UserNotificationSettings>;
}) {
  const validationT = useTranslations("validations");
  const userNotificationSettingsVali =
    userNotificationSettingsSchema(validationT);

  const [isSaving, setIsSaving] = useState(false);
  const { updateMyNotificationSettings } = useProfile();

  const defaultValues: UserNotificationSettings = {
    aiPrompt: notificationSettings?.aiPrompt ?? null,
    newJobEmailNotifications:
      notificationSettings?.newJobEmailNotifications ?? false,
  };

  const notificationsForm = useCustomForm<UserNotificationSettings>({
    validationSchema: userNotificationSettingsVali,
    defaultValues,
    onSubmit: async (values) => {
      console.log("data being sent", values);
      setIsSaving(true);
      try {
        await updateMyNotificationSettings(values);
      } catch {
        console.error(
          "Failed to save notification settings. Please try again.",
        );
      } finally {
        setIsSaving(false);
      }
    },
  });

  const newJobEmailNotifications = useStore(
    notificationsForm.store,
    (state) => state.values.newJobEmailNotifications,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        notificationsForm.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* New Job Email Notifications toggle */}
      <notificationsForm.Field
        name="newJobEmailNotifications"
        validators={{
          onChange: ({ value }) =>
            userNotificationSettingsVali.shape.newJobEmailNotifications.safeParse(
              value,
            ).success
              ? undefined
              : userNotificationSettingsVali.shape.newJobEmailNotifications.safeParse(
                  value,
                ).error?.issues[0].message,
        }}
      >
        {(field) => (
          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="space-y-0.5">
              <label
                htmlFor="newJobEmailNotifications"
                className="text-sm font-medium leading-none"
              >
                New Job Email Notifications
              </label>
              <p className="text-sm text-muted-foreground">
                Receive emails about new job listings that match your interests
              </p>
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
            <Switch
              id="newJobEmailNotifications"
              checked={field.state.value}
              onCheckedChange={field.handleChange}
            />
          </div>
        )}
      </notificationsForm.Field>

      {/* AI Prompt – only visible when email notifications are on */}
      {newJobEmailNotifications && (
        <FormField
          form={notificationsForm}
          name="aiPrompt"
          label="Filter Prompt"
          description="Our AI will use this prompt to filter job listings and only send you notifications for jobs that match your criteria."
          validator={(value) => {
            const result =
              userNotificationSettingsVali.shape.aiPrompt.safeParse(value);
            return result.success ? undefined : result.error.issues[0].message;
          }}
          render={(field) => (
            <input
              id="aiPrompt"
              type="text"
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="For example: I am looking for remote frontend development positions 
              that use React and pay at least $100k per year."
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-50"
            />
          )}
        />
      )}

      {/* Save button */}
      <div className="flex justify-end">
        <SubmitButton isSubmitting={isSaving} buttonText="Save Preferences" />
      </div>
    </form>
  );
}
