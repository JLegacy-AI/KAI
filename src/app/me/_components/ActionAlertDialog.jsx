import { AlertDialog, Button, Flex } from "@radix-ui/themes";

export default function ActionAlertDialog({
  children,
  title,
  description,
  onAction,
  actionLabel = "Revoke access",
}) {
  return (
    <AlertDialog.Root onClick={(e) => e.stopPropagation()}>
      <AlertDialog.Trigger onClick={(e) => e.stopPropagation()}>
        {children}
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          {description}
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={onAction}>
              {actionLabel}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
