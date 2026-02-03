export interface OrgListTranslations {
  title: string;
  subTitle: string;
  loadingText: string;
  createOrganization: string;
  securedBy: string;
  contactSupport: string;
  nevermind: string;
  organizationBanned: {
    title: string;
    message: string;
  };
  verificationRequired: {
    title: string;
    message: string;
  };
  badges: {
    banned: string;
    unverified: string;
    verified: string;
  };
  memberCount: {
    singular: string;
    plural: string;
  };
  jobCount: {
    singular: string;
    plural: string;
  };
}

export const defaultTranslations: OrgListTranslations = {
  title: "Choose an account",
  subTitle: "Select the account with which you wish to continue.",
  loadingText: "Loading organizations...",
  createOrganization: "Create organization",
  securedBy: "Secured by",
  contactSupport: "Contact Support",
  nevermind: "Nevermind",
  organizationBanned: {
    title: "Organization Banned",
    message:
      "This organization has been banned. Please contact the support team for further action",
  },
  verificationRequired: {
    title: "Verification Required",
    message:
      "This organization is not yet verified. Please contact the support team for verification",
  },
  badges: {
    banned: "Banned",
    unverified: "Unverified",
    verified: "Verified",
  },
  memberCount: {
    singular: "member",
    plural: "members",
  },
  jobCount: {
    singular: "job",
    plural: "jobs",
  },
};
