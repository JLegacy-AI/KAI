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
  Spinner
} from "@radix-ui/themes";
import { trpc } from "@/app/_trpc/client";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import CreateBotForm from "../../_components/CreateBotForm";
import { useRouter } from "next/navigation";

export default function UpdateBotPage({ params }) {
  const router = useRouter();
  const { botId } = params;
  const getBot = trpc.user.getBot.useQuery({
    botId,
  });
  const updateBotMutation = trpc.user.updateBot.useMutation({
    onSuccess: (data) => {
      console.log("[updateBot] Data: ", data);
      toast.success("Bot updated bot successfully");
    },
    onError: (error) => {
      console.log("[error@updateBot]: ", error.message);
      toast.error(error.message);
    },
  });

  return (
    <Box className="w-full h-full bg-gray-50 flex flex-col">
      <Flex justify="center" align="center" className="flex-1">
        {getBot?.isLoading ? (
          <Spinner />
        ) : (
          <CreateBotForm
            onSubmit={(bot) =>
              updateBotMutation.mutate({
                botId,
                ...bot,
              })
            }
            botData={getBot?.data}
            isLoading={updateBotMutation?.isLoading}
          />
        )}
      </Flex>
    </Box>
  );
}
