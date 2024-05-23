import {
  Dialog,
  Button,
  Flex,
  TextField,
  Text,
  DropdownMenu,
  Select,
  TextArea,
} from "@radix-ui/themes";
import { l } from "@/lib/language";
import { entityTypes } from "@/lib/globals";
import { useState } from "react";

export default function EntityDetailDialog({
  isOpen,
  setIsOpen,
  triggerComponent,
  onSubmit,
}) {
  const [inputErrors, setInputErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const entity = {
      name: formData.get("entityName"),
      type: formData.get("entityType"),
      personality: formData.get("entityPersonality"),
    };

    const errors = {};

    if (!entity.name) errors.entityName = l("Entity name is required");
    if (!entity.type) errors.entityType = l("Entity type is required");
    if (!entity.personality || entity.personality.length < 20)
      errors.entityPersonality = l(
        "Entity personality must be at least 20 characters long"
      );

    setInputErrors(errors);

    if (Object.keys(errors).length === 0) {
      onSubmit?.(entity);
      setIsOpen(false);
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      {triggerComponent && <Dialog.Trigger>{triggerComponent}</Dialog.Trigger>}

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>{l("Entity Detail")}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {l("Provide details for the entity in question")}
        </Dialog.Description>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                {l("Entity Name")}
              </Text>
              <TextField.Root
                placeholder={l("Enter full name")}
                name="entityName"
              />
              {inputErrors.entityName && (
                <Text size="1" color="red">
                  {inputErrors.entityName}
                </Text>
              )}
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                {l("Entity Type")}
              </Text>
              <Select.Root name="entityType">
                <Select.Trigger
                  className="w-full"
                  placeholder={l("Select entity type")}
                />
                <Select.Content size="1">
                  <Select.Group>
                    {entityTypes?.map((et, idx) => (
                      <Select.Item value={et} key={idx} className="capitalize">
                        {l(et)}
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
              {inputErrors.entityType && (
                <Text size="1" color="red">
                  {inputErrors.entityType}
                </Text>
              )}
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                {l("Entity Personality")}
              </Text>
              <TextArea
                placeholder={l("Briefly describe the entities profile")}
                resize="none"
                name="entityPersonality"
              />
              {inputErrors.entityPersonality && (
                <Text size="1" color="red">
                  {inputErrors.entityPersonality}
                </Text>
              )}
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>

            <Button type="submit">Save</Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
