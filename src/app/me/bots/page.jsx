"use client";

import {
  Box,
  Button,
  Grid,
  Heading,
  Tabs,
  Text,
  Card,
  Spinner,
  IconButton,
} from "@radix-ui/themes";
import Link from "next/link";
import Navbar from "./_components/Navbar";
import { trpc } from "@/app/_trpc/client";
import FilesSidebar from "../_components/FilesSidebar";
import { useEffect } from "react";
import { FileIcon, PencilIcon, TrashIcon } from "lucide-react";
import toast from "react-hot-toast";
import { convertTokenToWordCount } from "../utils";
import BOT_ from "../../../../public/assets/bot_4.jpg";
import Image from "next/image";

export default function ViewBotsPage() {
  const user = trpc.user.get.useQuery(undefined, {});

  const getBots = trpc.user.getBots.useQuery(undefined, {
    onSuccess: (data) => {
      console.log("[getBots] Data: ", data);
    },
    onError: (error) => {
      console.log("[error@getBots]: ", error.message);
    },
  });

  const deleteBotMutation = trpc.user.deleteBot.useMutation({
    onSuccess: (data) => {
      console.log("[deleteBot] Data: ", data);
      toast.success("Bot deleted successfully");
      getBots.refetch();
    },
    onError: (err) => {
      toast.error("Failed to delete bot");
      console.log("[error@deleteBot]: ", err.message);
    },
  });

  return (
    <Box className="relative">
      <Heading className="text-start my-4 px-7 text-lg">Your Bots</Heading>
      {getBots?.isLoading ? (
        <Box className="w-full flex items-center justify-center">
          <Spinner />
        </Box>
      ) : getBots?.data?.length === 0 ? (
        <Box className="w-full my-2">
          <Text className="text-center" as="p">
            No Bots Found
          </Text>
        </Box>
      ) : (
        <Box className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-center gap-4">
          {getBots?.data?.map((bot, idx) => (
            <Card
              className="bg-white px-4 py-4 flex flex-col justify-between w-[300px] min-h-[100px]"
              key={idx}
            >
              <Box>
                <Image
                  className="border rounded-md mb-2"
                  width={60}
                  height={60}
                  src={BOT_}
                />
                <Heading size="4">{bot.name}</Heading>
                <Text as="p" size="1" color="gray" className="mt-1">
                  {bot.description}
                </Text>
              </Box>
              <Box className="mt-2 flex justify-between items-center">
                <Text as="p" size="2" color="gray">
                  {/* Convert token count to word count */}
                  Word Count:{" "}
                  {new Intl.NumberFormat().format(
                    convertTokenToWordCount(bot.trainingTokenCount)
                  )}
                </Text>
                {user?.data?.id == bot.creator && (
                  <Box className="flex gap-2">
                    <IconButton
                      size="1"
                      className="cursor-pointer"
                      variant="soft"
                      asChild
                    >
                      <Link href={`/me/bots/${bot.id}/files`}>
                        <FileIcon size="14" />
                      </Link>
                    </IconButton>
                    <IconButton
                      size="1"
                      className="cursor-pointer"
                      variant="soft"
                      asChild
                    >
                      <Link href={`/me/bots/${bot.id}/update`}>
                        <PencilIcon size="14" />
                      </Link>
                    </IconButton>
                    <IconButton
                      size="1"
                      className="cursor-pointer"
                      variant="soft"
                      onClick={() =>
                        deleteBotMutation.mutate({ botId: bot.id })
                      }
                    >
                      <TrashIcon size="14" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
