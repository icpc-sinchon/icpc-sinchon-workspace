import type React from "react";
import { useState } from "react";
import { Dialog, Flex, Button } from "@radix-ui/themes";
import Toast from "@/components/Toast";
import { COLORS } from "@/styles/colors";

type ToastType = "success" | "error";

type Props = {
  title: string;
  description?: string;
  onFormSubmit: () => void;
  children: React.ReactNode;
};

function FormDialog({ title, description, onFormSubmit, children }: Props) {
  const [open, setOpen] = useState(false);
  const [toastType, setToastType] = useState<ToastType>("success");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onFormSubmit();
      setOpen(false);
      setToastType("success");
      setToastMessage(`${title} 작업 완료`);
    } catch (error) {
      console.error(error);
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
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          <Button>{title}</Button>
        </Dialog.Trigger>
        <Dialog.Content aria-describedby={title}>
          <Dialog.Title>{title}</Dialog.Title>
          {description && (
            <Dialog.Description>{description}</Dialog.Description>
          )}
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3">
              {children}
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    취소
                  </Button>
                </Dialog.Close>
                <Button
                  type="submit"
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  제출
                </Button>
              </Flex>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}

export default FormDialog;
