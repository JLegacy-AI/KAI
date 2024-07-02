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
} from "@radix-ui/themes";
import { trpc } from "@/app/_trpc/client";
import { convertTokenToWordCount } from "../../utils";
import BOT_ from "../../../../../public/assets/bot_3.jpg";
import Image from "next/image";

export default function BotsCommunityPage() {
  const getCommunityBots = trpc.user.getCommunityBots.useQuery(undefined, {
    onSuccess: (data) => {
      console.log("[getBots] Data: ", data);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log("[error@getBots]: ", error.message);
    },
  });

  const addBotMutation = trpc.user.addBot.useMutation({
    onSuccess: (data) => {
      getCommunityBots.refetch();
      toast.success(`${data.bot.name} Bot added successfully`);
      console.log("[addBotMutation] Data: ", data);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log("[error@addBotMutation]: ", error.message);
    },
  });

  return (
    <Box className="">
      <Heading className="text-center my-4">Community Bots</Heading>
      {getCommunityBots?.isLoading ? (
        <Box className="w-full flex items-center justify-center">
          <Spinner />
        </Box>
      ) : getCommunityBots?.data?.length === 0 ? (
        <Box className="w-full my-2">
          <Text className="text-center" as="p">
            No Bots Found
          </Text>
        </Box>
      ) : (
        <Box className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-center gap-4">
          {getCommunityBots?.data?.map((bot, idx) => (
            <Card
              className="bg-white px-4 py-4 flex flex-col justify-between w-[300px] min-h-[100px]"
              key={idx}
            >
              <Box>
                <Image
                  className="border rounded-md mb-3"
                  height={60}
                  src={BOT_}
                />
                <Heading size="4">{bot.name}</Heading>
                <Text as="p" size="1" color="gray" className="mt-1">
                  {bot.description}
                </Text>
              </Box>
              <Box className="mt-2 flex justify-between items-end">
                <Box>
                  <Text as="p" size="2" color="gray">
                    Word Count:{" "}
                    {new Intl.NumberFormat().format(
                      convertTokenToWordCount(bot.trainingTokenCount)
                    )}
                  </Text>
                  <Text as="p" size="1" color="gray">
                    Creator: {bot?.creator?.name}
                  </Text>
                </Box>
                <Button
                  size="1"
                  onClick={() =>
                    addBotMutation.mutate({
                      botId: bot.id,
                    })
                  }
                >
                  Import
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
