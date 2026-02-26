"use client";

import { useCustomForm } from "@/hooks/use-custom-form";
import {
  UserNotificationSettings,
  userNotificationSettingsSchema,
} from "@/schemas";
import { useTranslations } from "next-intl";
import { FormField } from "../FormField";
import { Switch } from "../ui/switch";
import { FormControl, FormDescription, FormItem, FormLabel } from "../ui/form";
import TextField from "../form/TextField";
import { useStore } from "@tanstack/react-form";

export function NotificationsForm({
  notificationSettings,
}: {
  notificationSettings?: any;
}) {
  const validationT = useTranslations("validations");
  const userNotificationSettingsVali =
    userNotificationSettingsSchema(validationT);

  const notificationsForm = useCustomForm({
    validationSchema: userNotificationSettingsVali,
    defaultValues: notificationSettings ?? {
      aiPrompt: "",
      newJobEmailNotifications: false,
    },
    onSubmit: (values: UserNotificationSettings) => {
      console.log(values);
    },
  });

  const newJobEmailNotifications = useStore(
    notificationsForm.store,
    (state) => state.values.newJobEmailNotifications
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        notificationsForm.handleSubmit();
      }}
      className={"space-y-6"}
    >
      <div className="flex items-center justify-between">
        <FormField
          form={notificationsForm}
          name="newJobEmailNotifications"
          label="New Job Email Notifications"
          description="Receive emails about new job listings that match your interests"
          validator={(value) => {
            const result =
              userNotificationSettingsVali.shape.newJobEmailNotifications.safeParse(
                value,
              );
            return result.success ? undefined : result.error.issues[0].message;
          }}
          render={(field) => (
            <Switch
              checked={field.state.value}
              onCheckedChange={field.handleChange}
            />
          )}
        />
        {newJobEmailNotifications && (
          <FormField
            form={notificationsForm}
            name="aiPrompt"
            label="Filter Prompt"
            validator={(value) => {
              const result =
                userNotificationSettingsVali.shape.aiPrompt.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0].message;
            }}
            render={(field) => (
              <FormItem>
                <div className="space-y-0.5">
                  <FormLabel>Filter Prompt</FormLabel>
                  <FormDescription>
                    Our AI will use this prompt to filter job listings and only
                    send you notifications for jobs that match your criteria.
                  </FormDescription>
                </div>
                <FormControl>
                  <TextField {...field}></TextField>
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>
    </form>
  );
}
