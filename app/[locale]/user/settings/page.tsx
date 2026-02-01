"use client";

import { useEffect, useMemo, useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import PageLoader from "@/components/PageLoader";
import { useTranslations } from "next-intl";
import { LoadingSwap } from "@/components/LoadingSwap";
import { useForm } from "@tanstack/react-form";
import { createUpdateProfileSchema } from "@/schemas";
import { X } from "lucide-react";
import ProfileImage from "@/components/ProfileImage";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import ProfileItem from "@/components/ProfileItem";

export default function UserSettingsPage() {
  const { user: currentUser, updateProfile, isUpdating } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = useTranslations();
  const profileT = (key: string) => t(`user.settings.profile.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);

  // Define validation schema
  const updateProfileSchema = useMemo(
    () => createUpdateProfileSchema(validationT),
    [validationT]
  );

  // Initialize TanStack Form with current user data
  const form = useForm({
    defaultValues: {
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      username: currentUser?.username || "",
      phoneNumber: currentUser?.phoneNumber || "",
      image: null as File | null,
      imageUrl: currentUser?.imageUrl || "",
    },
    onSubmit: async ({ value }) => {
      try {
        // Always create FormData
        const formData = new FormData();
        formData.append("firstName", value.firstName);
        formData.append("lastName", value.lastName);
        formData.append("username", value.username);
        formData.append("phoneNumber", value.phoneNumber);

        // Add image only if it exists
        if (value.image) {
          formData.append("image", value.image);
        }

        await updateProfile(formData);
        setIsModalOpen(false);
      } catch (error: any) {
        console.error("Failed to update profile", error);
      }
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = updateProfileSchema.safeParse(value);
        return result.success ? undefined : result.error.format();
      },
    },
  });

  // Re-populate form when modal opens
  useEffect(() => {
    if (currentUser && isModalOpen) {
      form.setFieldValue("firstName", currentUser.firstName || "");
      form.setFieldValue("lastName", currentUser.lastName || "");
      form.setFieldValue("username", currentUser.username || "");
      form.setFieldValue("phoneNumber", currentUser.phoneNumber || "");
      form.setFieldValue("imageUrl", currentUser.imageUrl || "");
      form.setFieldValue("image", null);
    }
  }, [currentUser, isModalOpen, form]);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.reset();
  };

  if (!currentUser) {
    return <PageLoader />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-sans font-semibold text-gray-900 dark:text-white mb-10">
          {profileT("title")}
        </h1>

        {/* Profile Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {currentUser.imageUrl ? (
                    <ProfileImage
                      value={currentUser.imageUrl}
                      editable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-600 dark:text-gray-300">
                      {currentUser.firstName?.[0]}
                      {currentUser.lastName?.[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {profileT("profile")}
                </label>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  @{currentUser.username}
                </p>
              </div>
            </div>
            <Button className="yellow-btn" onClick={() => setIsModalOpen(true)}>
              {profileT("updateProfile")}
            </Button>
          </div>
        </div>

        {/* Phone Number Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 py-8">
          <div className="space-y-3">
            {currentUser.phoneNumber ? (
              <ProfileItem
                title={profileT("phoneNumber")}
                value={currentUser.phoneNumber}
              />
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {profileT("noPhoneNumber")}
              </div>
            )}
          </div>
        </div>

        {/* Date of Birth Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 py-8">
          <ProfileItem
            title={profileT("dob")}
            value={formatDate(currentUser.dateOfBirth)}
          />
        </div>

        {/* Account Information Section */}
        <div className="py-8">
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
            {profileT("accountInformation")}
          </label>
          <div className="space-y-3">
            <ProfileItem
              title={profileT("accountType")}
              value={currentUser.userRole}
            />
            <ProfileItem
              title={profileT("memberSince")}
              value={formatDate(currentUser.createdAt)}
            />
            <ProfileItem
              title={profileT("lastUpdated")}
              value={formatDate(currentUser.updatedAt)}
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="min-h-screen bg-black/70 dark:bg-black/70 fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-[95%] max-w-2xl p-12 border border-gray-300 dark:border-gray-700">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-semibold text-gray-900 dark:text-white">
                  {profileT("editProfile")}
                </h2>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="p-6 space-y-6"
            >
              {/* Profile Image Upload */}
              <form.Field name="image">
                {(field) => (
                  <ProfileImage
                    editable={true}
                    value={field.state.value || form.state.values.imageUrl}
                    onChange={(file) => field.handleChange(file)}
                    fallbackInitials={`${currentUser.firstName?.[0] || ""}${
                      currentUser.lastName?.[0] || ""
                    }`}
                    label={profileT("clickToUploadPhoto")}
                    error={field.state.meta.errors?.[0]}
                    size="lg"
                  />
                )}
              </form.Field>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  form={form}
                  name="firstName"
                  label={profileT("firstName")}
                  type="text"
                  placeholder="John"
                  validator={(value) => {
                    const result =
                      updateProfileSchema.shape.firstName.safeParse(value);
                    return result.success
                      ? undefined
                      : result.error.issues[0].message;
                  }}
                />

                <FormField
                  form={form}
                  name="lastName"
                  label={profileT("lastName")}
                  type="text"
                  placeholder="Doe"
                  validator={(value) => {
                    const result =
                      updateProfileSchema.shape.lastName.safeParse(value);
                    return result.success
                      ? undefined
                      : result.error.issues[0].message;
                  }}
                />
              </div>

              {/* Username */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  @
                </span>
                <FormField
                  form={form}
                  name="username"
                  label={profileT("username")}
                  type="text"
                  placeholder="johndoe"
                  validator={(value) => {
                    const result =
                      updateProfileSchema.shape.username.safeParse(value);
                    return result.success
                      ? undefined
                      : result.error.issues[0].message;
                  }}
                />
              </div>

              {/* Phone Number */}
              <FormField
                form={form}
                name="phoneNumber"
                label={profileT("phoneNumber")}
                type="tel"
                placeholder="+66123123123"
                validator={(value) => {
                  const result =
                    updateProfileSchema.shape.phoneNumber.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                }}
              />

              {/* Modal Footer */}
              <div className="w-full flex gap-2 justify-end">
                <Button
                  onClick={handleCancel}
                  disabled={isUpdating}
                  variant={"destructive"}
                  className="h-12"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating} className="h-12">
                  <LoadingSwap isLoading={isUpdating}>
                    {profileT("saveChanges")}
                  </LoadingSwap>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
