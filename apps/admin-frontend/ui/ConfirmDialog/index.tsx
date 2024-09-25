import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { useState } from "react";
import Toast from "@/components/Toast";
import { COLORS } from "@/styles/colors";

type ToastType = "success" | "error";

type Props = {
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
};

function ConfirmDialog({ title, description, onConfirm }: Props) {
  const [open, setOpen] = useState(false);
  const [toastType, setToastType] = useState<ToastType>("success");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      await onConfirm();
      setOpen(false);
      setToastType("success");
      setToastMessage(`${title} 작업 완료`);
    } catch (error) {
      setToastType("error");
      setToastMessage(`${title} 작업 실패: ${error.message}`);
    } finally {
      setIsLoading(false);
      setShowToast(true);
    }
  };

  return (
    <>
      <Toast
        text={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
        color={
          toastType === "success" ? COLORS.primarySurface : COLORS.errorText
        }
      />
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger>
          <Button variant="soft" type="submit">
            {title}
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>{title} 확인</AlertDialog.Title>
          <AlertDialog.Description>{description}</AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                취소
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                variant="solid"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "확인"}
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
}

export default ConfirmDialog;
