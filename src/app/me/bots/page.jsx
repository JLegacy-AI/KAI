"use client";

import { Box, Button, Grid, Heading, Tabs, Text, Card } from "@radix-ui/themes";
import Link from "next/link";
import Navbar from "./_components/Navbar";
import { trpc } from "@/app/_trpc/client";

export default function ViewBotsPage() {
  const getBots = trpc.user.getBots.useQuery(undefined, {
    onSuccess: (data) => {
      console.log("[getBots] Data: ", data);
    },
    onError: (error) => {
      console.log("[error@getBots]: ", error.message);
    },
  });

  return (
    <Box className="">
      <Heading className="text-center my-4">Your Bots</Heading>
      <Box className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-4">
        {
          getBots?.data?.map((bot, idx) => (
            <Card
              className="bg-white px-4 py-4 flex flex-col justify-between w-[300px] min-h-[100px]"
              key={idx}
            >
              <Box>
                <Heading size="4">{bot.name}</Heading>
                <Text as="p" size="1" color="gray" className="mt-1">{bot.description}</Text>


              </Box>
              <Box className="mt-2 flex justify-between items-center">
              <Text as="p" size="2" color="gray">Word Count: 20</Text>
                <Button size="1">View Files</Button>
              </Box>
            </Card>
          ))}
      </Box>
    </Box>
  );
}
