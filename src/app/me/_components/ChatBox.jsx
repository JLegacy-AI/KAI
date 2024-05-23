"use client";
import {
  Box,
  Flex,
  Heading,
  ScrollArea,
  SegmentedControl,
  TextArea,
  Button,
  Text,
  Separator,
  IconButton,
  Spinner,
} from "@radix-ui/themes";
import { twMerge } from "tailwind-merge";
import TopBarWrapper from "./TopBarWrapper";
import {
  BotIcon,
  FolderOpenIcon,
  MessageSquareTextIcon,
  Type,
  UserRoundIcon,
} from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MessageBox from "./MessageBox";
import { l } from "@/lib/language";
import toast from "react-hot-toast";

export default function ChatBox({
  className,
  TopBar,
  chatSession,
  isChatSessionLoading,
  askAiMutation,
  isAskAiMutationLoading,
}) {
  const [userInput, setUserInput] = useState("");
  const searchParams = useSearchParams();

  return (
    <Box
      className={twMerge(
        "w-full h-full overflow-hidden flex flex-col",
        className
      )}
    >
      {/* Top Bar */}
      {TopBar}
      {/* Messages */}
      {chatSession?.messages?.length > 0 ? (
        <ScrollArea className="flex-1 px-4 bg-gray-50" scrollbars="vertical">
          {chatSession.messages.map((msg, idx) => {
            return <MessageBox key={idx} {...msg} />;
          })}
          {/* Add Typing Effect */}
          {isAskAiMutationLoading && (
            <MessageBox
              role="ai"
              message={l("Thinking...")}
              className="animate-pulse"
            />
          )}
          {/* Also works can use this after loading {askAi.isLoading ? <p>Loading...</p> : null} */}
        </ScrollArea>
      ) : (
        <Box className="flex-1 px-4 flex items-center justify-center text-center text-gray-600">
          {isChatSessionLoading ? (
            <Spinner />
          ) : (
            <Text size="4">{l("start a conversation")}</Text>
          )}
        </Box>
      )}
      {/* Input */}
      <Box className="border-t p-4">
        <TextArea
          placeholder={l("send a message")}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <Flex className="items-center justify-between mt-2">
          <Button
            size="1"
            className="cursor-pointer"
            // onClick={handleSendMessage}
            onClick={() => {
              askAiMutation.mutate({
                // TODO check if chatSessionId is not provided, also get a bot id
                question: { content: userInput },
                displayMessage: userInput,
                chatSessionId: searchParams.get("chat_session_id") || "new",
              });
              setUserInput("");
            }}
            disabled={isAskAiMutationLoading}
          >
            {l("Send")}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

const dummyMessages = [
  {
    message: "Hello there!",
    role: "user",
  },
  {
    message: "Hi!, How can I help you?",
    role: "ai",
  },
  {
    message: "I need help with my account",
    role: "user",
  },
  {
    message:
      "Sure, I can help you with that, can you provide me with more details?",
    role: "ai",
  },
  {
    message:
      "So I can't login to my account, I've tried resetting my password but it's not working. I have a lot of important documents in my account that I need to access.",
    role: "user",
  },
  {
    message:
      "I am sorry you have to go through this, here are some steps you can take to recover your account: \n 1. Visit the login page \n 2. Click on the 'Forgot Password' link \n 3. Enter your email address \n 4. Check your email for a password reset link \n 5. Click on the link to reset your password \n 6. Login with your new password",
    role: "ai",
  },
  {
    message: "Thank you, I will try that now",
    role: "user",
  },
];
