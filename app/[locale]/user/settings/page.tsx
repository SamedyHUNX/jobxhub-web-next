"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import PageLoader from "@/components/PageLoader";
import { useTranslations } from "next-intl";
import { createUpdateProfileSchema } from "@/schemas";
import ProfileImage from "@/components/ProfileImage";
import { Button } from "@/components/ui/button";
import { useCustomForm } from "@/hooks/use-custom-form";
import SubmitButton from "@/components/SubmitButton";
import { FormField } from "@/components/FormField";
import { Modal } from "@/components/Modal";

function ProfileItem({ title, value }: { title: string; value: any }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600 dark:text-gray-400">{title}</span>
      <span className="text-sm text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

export default function UserSettingsPage() {
  const { user: currentUser, updateProfile } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const t = useTranslations();
  const profileT = (key: string) => t(`user.settings.profile.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);

  // Define validation schema
  const updateProfileSchema = createUpdateProfileSchema(validationT);

  const updateProfileForm = useCustomForm({
    defaultValues: {
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      username: currentUser?.username || "",
      phoneNumber: currentUser?.phoneNumber || "",
      image: null as File | null,
      imageUrl: currentUser?.imageUrl || "",
    },
    validationSchema: updateProfileSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("username", values.username);
        formData.append("phoneNumber", values.phoneNumber);

        // Add image only if it exists
        if (values.image) {
          formData.append("image", values.image);
        }

        await updateProfile(formData);
        setIsModalOpen(false);
      } catch (error) {
        // Error handling is done in the hook
        console.error("Failed to update profile:", error);
      }
    },
  });

  // Re-populate form when modal opens
  useEffect(() => {
    if (currentUser && isModalOpen) {
      updateProfileForm.setFieldValue("firstName", currentUser.firstName || "");
      updateProfileForm.setFieldValue("lastName", currentUser.lastName || "");
      updateProfileForm.setFieldValue("username", currentUser.username || "");
      updateProfileForm.setFieldValue(
        "phoneNumber",
        currentUser.phoneNumber || "",
      );
      updateProfileForm.setFieldValue("imageUrl", currentUser.imageUrl || "");
      updateProfileForm.setFieldValue("image", null);
    }
  }, [currentUser, isModalOpen, updateProfileForm]);

  const handleCancel = () => {
    setIsModalOpen(false);
    updateProfileForm.reset();
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
      >
        <Modal.Header onClose={() => setIsModalOpen(false)}>
          {profileT("editProfile")}
        </Modal.Header>

        <Modal.Body>
          {/* Modal Body */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              updateProfileForm.handleSubmit();
            }}
            className="p-6 space-y-6"
          >
            {/* Profile Image Upload */}
            <updateProfileForm.Field name="image">
              {(field) => (
                <ProfileImage
                  editable={true}
                  value={
                    field.state.value || updateProfileForm.state.values.imageUrl
                  }
                  onChange={(file) => field.handleChange(file)}
                  fallbackInitials={`${currentUser.firstName?.[0] || ""}${
                    currentUser.lastName?.[0] || ""
                  }`}
                  label={profileT("clickToUploadPhoto")}
                  error={field.state.meta.errors?.[0]}
                  size="lg"
                />
              )}
            </updateProfileForm.Field>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                form={updateProfileForm}
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
                form={updateProfileForm}
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
                form={updateProfileForm}
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
              form={updateProfileForm}
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
            <SubmitButton
              isSubmitting={updateProfileForm.state.isSubmitting}
              buttonText={profileT("saveChanges")}
            />
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
