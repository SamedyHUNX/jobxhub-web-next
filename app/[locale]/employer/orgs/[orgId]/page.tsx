"use client";

import { FormField } from "@/components/FormField";
import { Modal } from "@/components/Modal";
import PageLoader from "@/components/PageLoader";
import ProfileImage from "@/components/ProfileImage";
import ProfileItem from "@/components/ProfileItem";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { useCustomForm } from "@/hooks/use-custom-form";
import { useOrgs } from "@/hooks/use-orgs";
import { generateSlug } from "@/lib/utils";
import { updateOrganizationSchema } from "@/schemas";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmployerOrgIdDashboardPage() {
  const { selectedOrgData, updateOrganization } = useOrgs();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { orgId: selectedOrgId } = useParams<{ orgId: string }>();

  const t = useTranslations();
  const profileT = (key: string) => t(`organizations.settings.profile.${key}`);
  const validationT = (key: string) => t(`validations.${key}`);

  // Define validation schema
  const updateOrgSchema = updateOrganizationSchema(validationT);

  const updateOrgForm = useCustomForm({
    defaultValues: {
      orgName: selectedOrgData?.orgName || "",
      description: selectedOrgData?.description || "",
      slug: selectedOrgData?.slug || "",
      imageFile: null as File | null,
    },
    validationSchema: updateOrgSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("orgName", values.orgName);
        formData.append("description", values.description);
        formData.append("slug", values.slug);

        // Add image only if it exists
        if (values.imageFile) {
          formData.append("image", values.imageFile);
        }

        await updateOrganization({ orgId: selectedOrgId!, data: formData });
        setIsModalOpen(false);
      } catch (error) {
        // Error handling is done in the hook
        console.error("Failed to update organization:", error);
      }
    },
  });

  // Re-populate form when modal opens
  useEffect(() => {
    if (selectedOrgData && isModalOpen) {
      updateOrgForm.setFieldValue("orgName", selectedOrgData.orgName || "");
      updateOrgForm.setFieldValue(
        "description",
        selectedOrgData.description || "",
      );
      updateOrgForm.setFieldValue("imageFile", null);
    }
  }, [selectedOrgData, isModalOpen, updateOrgForm]);

  if (!selectedOrgId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">
          {t("employer.orgs.noOrgSelected")}
        </p>
      </div>
    );
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    updateOrgForm.reset();
  };

  if (!selectedOrgData) {
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
          {`${selectedOrgData.orgName} ${profileT("title")}`}
        </h1>

        {/* Profile Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {selectedOrgData?.imageUrl ? (
                    <ProfileImage
                      value={selectedOrgData.imageUrl}
                      editable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-600 dark:text-gray-300">
                      {selectedOrgData?.orgName?.[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {profileT("organizationName")}
                </label>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  {selectedOrgData?.orgName}
                </p>
              </div>
            </div>
            <Button className="yellow-btn" onClick={() => setIsModalOpen(true)}>
              {profileT("updateProfile")}
            </Button>
          </div>
        </div>

        {/* Account Information Section */}
        <div className="py-8">
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
            {profileT("organizationInformation")}
          </label>
          <div className="space-y-3">
            <ProfileItem
              title={profileT("description")}
              value={selectedOrgData.description || "No description"}
            />
            <ProfileItem
              title={profileT("createdOn")}
              value={formatDate(selectedOrgData.createdAt)}
            />
            <ProfileItem
              title={profileT("lastUpdated")}
              value={formatDate(selectedOrgData.updatedAt)}
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCancel} size="lg">
        <Modal.Header onClose={handleCancel}>
          {profileT("editOrganization")}
        </Modal.Header>

        <Modal.Body>
          {/* Modal Body */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              updateOrgForm.handleSubmit();
            }}
            className="p-6 space-y-6"
          >
            {/* Profile Image Upload */}
            <updateOrgForm.Field name="imageFile">
              {(field) => (
                <ProfileImage
                  editable={true}
                  value={field.state.value || selectedOrgData.imageUrl}
                  onChange={(file) => field.handleChange(file)}
                  label={profileT("clickToUploadLogo")}
                  error={field.state.meta.errors?.[0]}
                  size="lg"
                />
              )}
            </updateOrgForm.Field>

            {/* Organization Name & Description */}
            <FormField
              form={updateOrgForm}
              name="orgName"
              label={profileT("organizationName")}
              type="text"
              placeholder="Acme Corporation"
              validator={(value) => {
                const result = updateOrgSchema.shape.orgName.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              }}
              onChange={(value) => {
                // Auto-generate orgSlug when org name changes
                updateOrgForm.setFieldValue("slug", generateSlug(value));
              }}
            />

            <FormField
              form={updateOrgForm}
              name="description"
              label={profileT("description")}
              type="textarea"
              placeholder="Tell us about your organization..."
              validator={(value) => {
                const result =
                  updateOrgSchema.shape.description.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              }}
            />

            <FormField
              form={updateOrgForm}
              name="slug"
              label={profileT("orgSlug")}
              placeholder="Auto-generated"
              disabled={true}
              validator={(value) => {
                const result = updateOrgSchema.shape.slug.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0].message;
              }}
            />

            <SubmitButton
              isSubmitting={updateOrgForm.state.isSubmitting}
              buttonText={profileT("saveChanges")}
            />
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
