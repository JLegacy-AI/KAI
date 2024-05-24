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
import CreateBotForm from "../_components/CreateBotForm";
import { useRouter } from "next/navigation";

export default function AddBotPage() {
  const router = useRouter();
  const createBotMutation = trpc.user.createBot.useMutation({
    onSuccess: (data) => {
      console.log("[createBot] Data: ", data);
      toast.success("Bot created successfully");
      setTimeout(() => router.push("/me/bots"), 500);
    },
    onError: (error) => {
      console.log("[error@createBot]: ", error.message);
      toast.error(error.message);
    },
  });

  return (
    <Box className="w-full h-full bg-gray-50 flex flex-col">
      <Flex justify="center" align="center" className="flex-1">
        <CreateBotForm
          onSubmit={createBotMutation.mutate}
          isLoading={createBotMutation?.isLoading}
        />
      </Flex>
    </Box>
  );
}
