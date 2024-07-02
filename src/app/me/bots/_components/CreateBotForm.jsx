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
import { trpc } from "@/app/_trpc/client";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import BOT_ from "../../../../../public/assets/bot_.jpg";

export default function CreateBotForm({ onSubmit, botData, isLoading, ref }) {
  const [inputErrors, setInputErrors] = useState({});
  const [botAccessType, setBotAccessType] = useState("private");

  useEffect(() => {
    if (botData) {
      setBotAccessType(botData.accessType);
    }
  }, [botData]);

  function handleSubmit(e) {
    e.preventDefault();
    let inpErrors = {};
    // Get Form Data
    const formData = new FormData(e.target);
    const botName = formData.get("name");
    const botDescription = formData.get("description");
    const botPrompt = formData.get("prompt");
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

    onSubmit?.({
      name: botName,
      description: botDescription,
      accessType: botAccessType,
      prompt: botPrompt,
    });
  }

  return (
    <form
      className="max-w-[400px] w-full bg-white p-8 rounded shadow-sm"
      onSubmit={handleSubmit}
    >
      <Flex direction="column" className="w-full h-full gap-4">
        <Box
          style={{
            width: "100%",
            height: "60px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            className="border rounded-md"
            width={60}
            height={60}
            src={BOT_}
          />
        </Box>
        <Heading className="text-center" size="6">
          {botData ? "Update" : "Add"} Bot
        </Heading>
        <TextField.Root
          placeholder="Bot Name"
          name="name"
          defaultValue={botData?.name || undefined}
        />
        {inputErrors.name && <Text color="red">{inputErrors.name}</Text>}
        <TextArea
          placeholder="Description"
          name="description"
          defaultValue={botData?.description || undefined}
        />
        {inputErrors.description && (
          <Text color="red">{inputErrors.description}</Text>
        )}
        <TextArea
          placeholder="Prompt (optional)"
          name="prompt"
          defaultValue={botData?.prompt || undefined}
        />
        <SegmentedControl.Root
          // defaultValue={botData?.accessType || "private"}
          value={botAccessType}
          onValueChange={(val) => setBotAccessType(val)}
        >
          <SegmentedControl.Item value="private">Private</SegmentedControl.Item>
          <SegmentedControl.Item value="public">Public</SegmentedControl.Item>
        </SegmentedControl.Root>
        <Button type="submit" loading={isLoading}>
          {botData ? "Update" : "Add"} Bot
        </Button>
      </Flex>
    </form>
  );
}
