import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import { twMerge } from "tailwind-merge";
import { UserRoundIcon, BotIcon } from "lucide-react";
import { l } from "@/lib/language";
import { layoutDir } from "@/lib/globals";

export default function MessageBox({ message, role, tokensUsed, className }) {
  return (
    <Box
      className={twMerge(
        "px-2 py-8 w-full border-b flex flex-col gap-2",
        className
      )}
      dir={layoutDir}
    >
      <Flex className="items-center gap-2">
        <Box className="rounded border border-gray-300 bg-white p-1">
          {role === "user" ? (
            <UserRoundIcon size="15px" />
          ) : (
            <BotIcon size="15px" />
          )}
        </Box>
        <Heading size="2" className="capitalize">
          {role === "user" ? l("You") : l("Bot")}
        </Heading>
        
      </Flex>
      <Text size="2" className="w-full whitespace-pre-line">
        {message}
      </Text>
      {tokensUsed > 0 && <Text size="1" color="gray">{l("Used &{0} Tokens.", [tokensUsed])}</Text>}
    </Box>
  );
}
