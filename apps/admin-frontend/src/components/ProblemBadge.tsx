import { Badge, Button } from "@radix-ui/themes";

function BOJProblemBadge({
  essential,
  bojProblemNumber,
  onDelete,
  isEditing,
}: {
  essential: boolean;
  bojProblemNumber: number;
  isEditing?: boolean;
  onDelete?: () => void;
}) {
  // 초록색이면 필수
  return (
    <Badge
      color={essential ? "green" : "cyan"}
      size="2"
      variant="surface"
      radius="full"
    >
      {bojProblemNumber}
      {isEditing && (
        <Button
          size="1"
          onClick={onDelete}
          radius="medium"
          color="red"
          type="button"
        >
          X
        </Button>
      )}
    </Badge>
  );
}

export default BOJProblemBadge;
