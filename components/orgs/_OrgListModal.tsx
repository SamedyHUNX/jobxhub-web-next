import { CustomDialog } from "../CustomDialog";
import { defaultTranslations } from "./_DefaultTranslation";

export function OrgListModal({
  modalState,
  onClose,
  translations,
}: {
  modalState: { isOpen: boolean; title: string; message: string };
  onClose: () => void;
  translations: typeof defaultTranslations;
}) {
  if (!modalState.isOpen) return null;

  return (
    <CustomDialog
      title={modalState.title}
      description={modalState.message}
      open={modalState.isOpen}
      onOpenChange={(open) => !open && onClose()}
      onCancel={onClose}
      cancelButtonText={translations.nevermind}
      href="/support"
      buttonText={translations.contactSupport}
    />
  );
}
