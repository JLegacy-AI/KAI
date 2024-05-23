"use client";

import { Box, Button, Grid, Heading, Tabs, Text, Card, Spinner } from "@radix-ui/themes";
import Link from "next/link";
import Navbar from "./_components/Navbar";
import { trpc } from "@/app/_trpc/client";
import FilesSidebar from "../_components/FilesSidebar";
import { useEffect } from "react";

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

  return (
    <Box className="relative">
      <Heading className="text-center my-4">Your Bots</Heading>
      {getBots?.isLoading ? (
        <Box className="w-full flex items-center justify-center">
          <Spinner />
        </Box>
      ) : (
        <Box className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-4">
          {getBots?.data?.map((bot, idx) => (
            <Card
              className="bg-white px-4 py-4 flex flex-col justify-between w-[300px] min-h-[100px]"
              key={idx}
            >
              <Box>
                <Heading size="4">{bot.name}</Heading>
                <Text as="p" size="1" color="gray" className="mt-1">
                  {bot.description}
                </Text>
              </Box>
              <Box className="mt-2 flex justify-between items-center">
                <Text as="p" size="2" color="gray">
                  Word Count: 20
                </Text>
                {user?.data?.id == bot.creator && (
                  <Button size="1" asChild>
                    <Link href={`/me/bots/${bot.id}/files`}>View Files</Link></Button>
                )}
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
