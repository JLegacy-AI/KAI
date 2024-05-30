import {
  Dialog,
  Button,
  Flex,
  TextField,
  Text,
  DropdownMenu,
  Select,
  TextArea,
  Progress,
  Spinner,
  DataList,
  Box,
} from "@radix-ui/themes";
import { l } from "@/lib/language";
import {  layoutDir } from "@/lib/globals";
import { useState } from "react";
import { getUsedTokensPercentage } from "../utils";
import toast from "react-hot-toast";
import { trpc } from "@/app/_trpc/client";

export default function SettingsModal({
  isOpen,
  setIsOpen,
  triggerComponent,
  user,
  onBuyTokens
}) {
  const buyTokensMutation = trpc.user.buyTokens.useMutation({
    onSuccess: (data) => {
      toast.success(l("Tokens bought successfully"));
      onBuyTokens?.(data);
      // console.log("[buyTokensMutation] Data: ", data);
    },
    onError: (error) => {
      toast.error("Failed to buy tokens");
      console.log("[error@buyTokensMutation]: ", error.message);
    },
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      {triggerComponent && <Dialog.Trigger>{triggerComponent}</Dialog.Trigger>}

      <Dialog.Content maxWidth="450px" dir={layoutDir}>
        <Dialog.Title>{l("User Settings")}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {l("User Details")}
        </Dialog.Description>
        {user ? (
          <Box>
            <DataList.Root>
              <DataList.Item>
                <DataList.Label>{l("Name")}</DataList.Label>
                <DataList.Value>{user.name}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>{l("Email")}</DataList.Label>
                <DataList.Value>{user.email}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>{l("Tokens Granted")}</DataList.Label>
                <DataList.Value>{user.tokensGranted}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>{l("Tokens Used")}</DataList.Label>
                <DataList.Value>{user.tokensUsed}</DataList.Value>
              </DataList.Item>
            </DataList.Root>
            <Progress
              value={getUsedTokensPercentage(
                user.tokensGranted,
                user.tokensUsed
              )}
              className="w-full my-4"
            />
            <Text as="p" className="text-center w-full" size="2">
              {l("Buy 10,000 Tokens for $1")}
            </Text>
          </Box>
        ) : (
          <Spinner />
        )}

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              {l("Cancel")}
            </Button>
          </Dialog.Close>

          <Button
            onClick={() => buyTokensMutation.mutate({
              tokens: 10000,
            })}
            loading={buyTokensMutation.isLoading}
          >
            {l("Buy More Tokens")}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
