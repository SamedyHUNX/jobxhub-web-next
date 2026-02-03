"use client";

import { OrgListTranslations } from "@/components/orgs/_DefaultTranslation";
import OrgsListContainer from "@/components/orgs/OrgListContainer";
import { useTranslations } from "next-intl";

export default function OrganizationSelectPage() {
  const t = useTranslations("orgList");

  const translations: OrgListTranslations = {
    title: t("chooseAccount.title"),
    subTitle: t("chooseAccount.subTitle"),
    loadingText: t("loading"),
    createOrganization: t("createOrganization"),
    securedBy: t("securedBy"),
    contactSupport: t("contactSupport"),
    nevermind: t("nevermind"),
    organizationBanned: {
      title: t("errors.banned.title"),
      message: t("errors.banned.message"),
    },
    verificationRequired: {
      title: t("errors.unverified.title"),
      message: t("errors.unverified.message"),
    },
    badges: {
      banned: t("badges.banned"),
      unverified: t("badges.unverified"),
      verified: t("badges.verified"),
    },
    memberCount: {
      singular: t("memberCount.singular"),
      plural: t("memberCount.plural"),
    },
    jobCount: {
      singular: t("jobCount.singular"),
      plural: t("jobCount.plural"),
    },
  };

  return <OrgsListContainer hidePersonal translations={translations} />;
}
