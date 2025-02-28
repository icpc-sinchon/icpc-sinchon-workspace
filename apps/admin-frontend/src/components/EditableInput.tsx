import React from "react";
import { Button, Flex, Text, TextField, Tooltip } from "@radix-ui/themes";

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
  helpertext?: string;
};

function EditableInput({
  label,
  value,
  onChange,
  type = "text",
  isEditing,
  helpertext,
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
      {helpertext && (
        <Tooltip content={helpertext} side="right" align="center">
          <Button size="1" type="button">
            ?
          </Button>
        </Tooltip>
      )}
    </Flex>
  );
}

export default EditableInput;
