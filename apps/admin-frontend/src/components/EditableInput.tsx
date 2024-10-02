import React from "react";
import { Flex, Text, TextField } from "@radix-ui/themes";

type InputProps = {
  label: string;
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
  onChange: (value: string) => void;
  isEditing: boolean;
  [key: string]: any;
};

function EditableInput({
  label,
  value,
  onChange,
  type = "text",
  isEditing,
}: InputProps) {
  return (
    <Flex align="center" gap="1">
      {label && <Text size="3">{label}:</Text>}
      {isEditing ? (
        <TextField.Root
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Text>{value}</Text>
      )}
    </Flex>
  );
}

export default EditableInput;
