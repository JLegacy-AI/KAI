"use client";

import {
  Container,
  SegmentedControl,
  TextArea,
  TextField,
  Button,
  Flex,
  Heading,
  Box,
} from "@radix-ui/themes";
import Navbar from "../_components/Navbar";
import { trpc } from "@/app/_trpc/client";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";

export default function AddBotPage() {
  const [inputErrors, setInputErrors] = useState({});
  const [botAccessType, setBotAccessType] = useState("private");
  const formRef = useRef(null);
  const createBotMutation = trpc.user.createBot.useMutation({
    onSuccess: (data) => {
      console.log("[createBot] Data: ", data);
      toast.success("Bot created successfully");
      formRef?.current?.reset();
    },
    onError: (error) => {
      console.log("[error@createBot]: ", error.message);
      toast.error(error.message);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    let inpErrors = {};
    // Get Form Data
    const formData = new FormData(e.target);
    const botName = formData.get("name");
    const botDescription = formData.get("description");
    let isError = false;

    if (!botName || botName?.length < 4) {
      inpErrors = {
        ...inpErrors,
        name: "Bot Name is required, minimum 4 characters",
      };

      isError = true;
    }

    if (!botDescription || botDescription?.length < 10) {
      inpErrors = {
        ...inpErrors,
        description: "Bot Description is required, minimum 10 characters",
      };
      isError = true;
    }

    setInputErrors(inpErrors);

    if (isError) return;

    createBotMutation.mutate({
      name: botName,
      description: botDescription,
      accessType: botAccessType,
    });
  }

  return (
    <Box className="w-full h-full bg-gray-50 flex flex-col">
      <Flex justify="center" align="center" className="flex-1">
        <form
          className="max-w-[400px] w-full bg-white p-8 rounded shadow-sm"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <Flex direction="column" className="w-full h-full gap-4">
            <Heading className="text-center" size="6">
              Add Bot
            </Heading>
            <TextField.Root placeholder="Bot Name" name="name" />
            {inputErrors.name && <Text color="red">{inputErrors.name}</Text>}
            <TextArea placeholder="Description" name="description" />
            {inputErrors.description && (
              <Text color="red">{inputErrors.description}</Text>
            )}
            <SegmentedControl.Root
              defaultValue="private"
              onValueChange={(val) => setBotAccessType(val)}
            >
              <SegmentedControl.Item value="private">
                Private
              </SegmentedControl.Item>
              <SegmentedControl.Item value="public">
                Public
              </SegmentedControl.Item>
            </SegmentedControl.Root>
            <Button type="submit" loading={createBotMutation.isLoading}>
              Add Bot
            </Button>
          </Flex>
        </form>
      </Flex>
    </Box>
  );
}
