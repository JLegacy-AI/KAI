"use client";

import { trpc } from "@/app/_trpc/client";
import { Flex, Box, Heading, Text, Spinner } from "@radix-ui/themes";
import { CircleCheckIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getCheckoutSessionData = trpc.user.getCheckoutSessionData.useQuery(
    {
      sessionId: searchParams.get("session_id"),
    },
    {
      enabled: !!searchParams.get("session_id"),
      onSuccess: (data) => {
        setTimeout(() => {
          router.replace("/me");
        }, 5000);
      },
      onError: (err) => {
        toast(err.message);
        console.log("Error: ", err.message);
      },
    }
  );

  useEffect(() => {}, []);

  return (
    <Box className="w-full h-full bg-gray-50">
      <Flex className="w-full h-full items-center justify-center p-8">
        <Box className="border bg-white py-4 px-16 rounded flex items-center justify-center flex-col text-center">
          {getCheckoutSessionData?.isLoading ? (
            <Spinner />
          ) : (
            <>
              <CircleCheckIcon size="60px" className="text-green-500" />
              <Heading className="my-4">Payment Successfull</Heading>
              <Text>
                Congratulations {getCheckoutSessionData?.data?.customer?.name}!
                You have successfully received 1 Million Tokens
              </Text>
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
