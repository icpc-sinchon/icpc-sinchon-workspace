import React from "react";
import { Flex, Text, Select } from "@radix-ui/themes";

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  name: string;
  options: Option[];
  defaultValue: string;
  value: string;
  onValueChange: (value: string) => void;
};

function FormSelect({
  label,
  name,
  options,
  defaultValue,
  value,
  onValueChange,
}: Props) {
  return (
    <Flex direction="column" gap="2" width="100%">
      <Text as="label" weight="bold">
        {label}
      </Text>
      <Select.Root
        name={name}
        size="3"
        defaultValue={defaultValue}
        value={value}
        onValueChange={(v: string) => onValueChange(v)}
      >
        <Select.Trigger />
        <Select.Content>
          {options.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );
}

export default FormSelect;
