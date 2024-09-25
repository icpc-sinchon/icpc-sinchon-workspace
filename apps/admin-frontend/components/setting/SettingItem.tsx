import { Flex, Heading } from "@radix-ui/themes";
import styled from "styled-components";
import React from "react";
import ConfirmDialog from "@/ui/ConfirmDialog";

function SettingWrap({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      as="div"
      direction="column"
      gap="1rem"
      justify="between"
      m="0 auto"
      width="100%"
    >
      {children}
    </Flex>
  );
}

function SettingItemTitle({ children }: { children: React.ReactNode }) {
  return (
    <Heading as="h2" size="5" weight="bold">
      {children}
    </Heading>
  );
}

const SettingForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export function SettingTab({
  tabTitle,
  onSubmit,
  children,
  confirmMessage,
}: {
  tabTitle: string;
  onSubmit: () => Promise<void>;
  children: React.ReactNode;
  confirmMessage?: string;
}) {
  return (
    <SettingWrap>
      <SettingItemTitle>{tabTitle}</SettingItemTitle>
      {/* TODO: Input 조건 충족 안 됐을 때 폼 제출 막기 */}
      <SettingForm onSubmit={(e) => e.preventDefault()}>
        {children}
        {confirmMessage && (
          <ConfirmDialog
            title={tabTitle}
            description={confirmMessage}
            onConfirm={onSubmit}
          />
        )}
      </SettingForm>
    </SettingWrap>
  );
}
