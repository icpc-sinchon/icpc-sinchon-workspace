import React from "react";
import { Button, Flex, Text, TextField, Tooltip } from "@radix-ui/themes";

type InputProps = {
  label: string;
  name: string;
  placeholder?: string;
  type?:
    | "date"
    | "datetime-local"
    | "email"
    | "hidden"
    | "month"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
  helpertext?: string;
};

function FormInput({
  label,
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  ...props
}: InputProps) {
  return (
    <Flex direction="column" gap="2" width="100%">
      <Text as="label" weight="bold">
        {label}
        {props.helpertext && (
          <Tooltip content={props.helpertext} side="right" align="center">
            <Button size="1" type="button" ml="2">
              ?
            </Button>
          </Tooltip>
        )}
      </Text>
      <TextField.Root
        size="3"
        id={name}
        name={name}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        {...props}
      />
    </Flex>
  );
}

export default FormInput;
