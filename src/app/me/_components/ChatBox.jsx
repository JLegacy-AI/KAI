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
  Select,
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
  userId,
}) {
  const getBots = trpc.user.getBots.useQuery();
  const [userInput, setUserInput] = useState("");
  const [selectedBotId, setSelectedBotId] = useState(null);
  const [isCreatingChatSession, setIsCreatingChatSession] = useState(false);
  const searchParams = useSearchParams();

  function handleSendMessage() {

    let uInput = userInput.trim();
    if (!uInput || uInput?.length == 0) return;

    askAiMutation.mutate({
      question: { content: userInput },
      displayMessage: userInput,
      chatSessionId: searchParams.get("chat_session_id") || "new",
    });
    setUserInput("");
  }

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

      {!searchParams.get("chat_session_id") ? (
        <Flex
          direction="column"
          className="w-full h-full items-center justify-center bg-gray-50"
        >
          {/* <Text as="p">Select an exisiting chat session</Text> */}
          {isCreatingChatSession ? (
            <Spinner />
          ) : (
            <Box className="flex flex-col w-[400px] gap-2">
              {getBots?.data && (
                <Select.Root
                  placeholder="Choose Bot"
                  onValueChange={(val) => setSelectedBotId(val)}
                >
                  <Select.Trigger placeholder="Choose Bot" />
                  <Select.Content size="1">
                    {getBots?.data?.map((bot, idx) => (
                      <Select.Item key={idx} value={bot.id}>
                        {bot.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              )}
              <TextArea
                placeholder="Ask Anything"
                className="border-0 outline-none"
                onChange={(e) => {
                  setUserInput(e.target.value);
                }}
              />
              <Button
                onClick={async () => {
                  if (!selectedBotId) return toast.error("Please select a bot");
                  console.log("UserInput: ", userInput.length);
                  if (!userInput || userInput.length < 2)
                    return toast.error(
                      "Query must be at least 10 characters long"
                    );

                  setUserInput("");
                  setIsCreatingChatSession(true);
                  await askAiMutation.mutateAsync({
                    question: { content: userInput },
                    displayMessage: userInput,
                    chatSessionId: searchParams.get("chat_session_id") || "new",
                    botId: selectedBotId,
                  });
                  setIsCreatingChatSession(false);
                }}
              >
                Ask
              </Button>
            </Box>
          )}
        </Flex>
      ) : chatSession?.messages?.length > 0 ? (
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
      {searchParams.get("chat_session_id") && (
        <Box
          className="border-t p-4"
        >
          <TextArea
            placeholder={l("send a message")}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyUp={(e) => {
              e.preventDefault();
              if(isAskAiMutationLoading) return;
              if (e.keyCode == 13 && e.shiftKey == false) {
                handleSendMessage();
              }
            }}
          />
          <Flex className="items-center justify-between mt-2">
            <Button
              size="1"
              className="cursor-pointer"
              onClick={handleSendMessage}
              disabled={isAskAiMutationLoading}
            >
              {l("Send")}
            </Button>
          </Flex>
        </Box>
      )}
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
