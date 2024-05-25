"use client";

import {
  Box,
  Button,
  Flex,
  IconButton,
  Heading,
  Text,
  Spinner,
} from "@radix-ui/themes";
import {
  BrainIcon,
  FolderOpenIcon,
  MessageSquareTextIcon,
  SettingsIcon,
} from "lucide-react";
import TopBarWrapper from "./_components/TopBarWrapper";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import FilesSidebar from "./_components/FilesSidebar";
import ChatSidebar from "./_components/ChatSidebar";
import ChatBox from "./_components/ChatBox";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SettingsModal from "./_components/SettingsModal";
import { l } from "@/lib/language";
import { layoutDir } from "@/lib/globals";
import Link from "next/link";

export default function UserDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const trpcUtils = trpc.useUtils();
  const getUser = trpc.user.get.useQuery(undefined, {
    onSuccess: (data) => {
      console.log("[getUser], Data: ", data);
    },
    onError: (error) => {
      console.log("[error@getUser]: ", error.message);
    },
  });
  const getUserChatSessions = trpc.user.getChatSessions.useQuery(undefined, {
    onSuccess: (data) => {
      console.log("[getChatSessions] Data: ", data);
    },
    onError: (error) => {
      console.log("[error@getUserChatSessions]: ", error.message);
    },
  });
  const getChatSession = trpc.user.getChatSession.useQuery(
    {
      id: searchParams.get("chat_session_id"),
    },
    {
      enabled: !!searchParams.get("chat_session_id"),
      onSuccess: (data) => {
        console.log("[getChatSession], Data: ", data);
      },
    }
  );

  function handleSearchParamChange(key, value) {
    if (!key) return;

    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  // using custom loading state for askAi mutation in order to keep track of the chat session id, that is loading the AI response
  const [isAskAiLoading, setIsAskAiLoading] = useState({
    loading: false,
    chatSessionId: searchParams.get("chat_session_id"),
  });

  const askAi = trpc.user.ai.ask.useMutation({
    onMutate: (data) => {
      setIsAskAiLoading({
        loading: true,
        chatSessionId: searchParams.get("chat_session_id"),
      });
      // FIXME added message is persisted even in the new chat session
      // console.log("[askAi] onMutate: ", data);

      const thisChatSessionId = searchParams.get("chat_session_id");
      const newUserMessage = {
        message: data.question.content,
        role: "user",
        tokensUsed: 0,
        usage: {
          inputTokens: 0,
          outputTokens: 0,
        },
      };
      trpcUtils.user.getChatSession.setData(
        {
          id: thisChatSessionId,
        },
        (chatSession) => {
          return {
            ...(chatSession ?? {}),
            messages: [...(chatSession?.messages ?? []), newUserMessage],
          };
        }
      );
    },
    onSuccess: (data) => {
      // console.log("[askAi] on Success:", data);

      // If the chat session is new, we update the search param with the newly created chat session id
      if (!searchParams.get("chat_session_id")) {
        handleSearchParamChange("chat_session_id", data.chatSessionId);
      }

      const thisChatSession = searchParams.get("chat_session_id");
      if (thisChatSession !== data.chatSessionId) return; // If the chat session id changes during the async call, we don't update the messages

      // We update the chat session with the new message from AI
      trpcUtils.user.getChatSession.setData(
        {
          id: thisChatSession,
        },
        (data) => {
          return {
            ...data,
            messages: [
              ...data.messages,
              {
                message: data.answer,
                role: "ai",
                usage: data.usage,
                tokensUsed: data.tokensUsed,
              },
            ],
          };
        }
      );

      getChatSession.refetch();
      getUser.refetch(); // Refetch the user to update the token count
    },
    onError: (error) => {
      toast.error(error.message);
      console.log("[askAi] onError: ", error.message);
      setIsAskAiLoading((prev) => ({ ...prev, loading: false }));
    },
    onSettled: (data) => {
      // If the chat session id changes while the mutation is in progress, we do nothing (as useEffect already updates the loading state to false), otherwise we set the loading state to false
      if (searchParams.get("chat_session_id") !== data.chatSessionId) return;
      setIsAskAiLoading({
        loading: false,
        chatSessionId: searchParams.get("chat_session_id"),
      });
    },
  });

  // By default, the sidebars are closed on mobile, and open on desktop
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [isFilesSidebarOpen, setIsFilesSidebarOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    getUserChatSessions.refetch();

    // If the chat session id changes, we set the loading state to false
    if (searchParams.get("chat_session_id") != isAskAiLoading.chatSessionId) {
      setIsAskAiLoading({
        loading: false,
        chatSessionId: searchParams.get("chat_session_id"),
      });
    }

    if (!searchParams.get("chat_session_id")) {
      trpcUtils.user.getChatSession.setData(
        {
          id: searchParams.get("chat_session_id"),
        },
        undefined
      );
      // console.log("Query Invalidated");
    }
  }, [searchParams]);

  // Set the sidebar to open on desktop
  useEffect(() => {
    if (typeof window !== undefined) {
      setIsChatSidebarOpen(window.innerWidth > 1024);
      setIsFilesSidebarOpen(window.innerWidth > 1024);
    }
  }, []);

  return (
    <Box className="w-screen h-screen" dir={layoutDir}>
      <SettingsModal
        isOpen={isSettingsModalOpen}
        setIsOpen={setIsSettingsModalOpen}
        user={getUser.data}
        onBuyTokens={(data) => getUser.refetch()}
      />
      <Flex className="w-full h-full">
        <ChatSidebar
          isOpen={isChatSidebarOpen}
          setIsOpen={setIsChatSidebarOpen}
          chatSessions={getUserChatSessions.data ?? []}
          onDeleteChatSession={() => {
            getUserChatSessions.refetch();
          }}
          user={getUser.data}
        />
        <ChatBox
          className="flex-1"
          // If there is no chat session id in the search params, loading is false, otherwise loading == .isLoading
          isChatSessionLoading={
            !searchParams.get("chat_session_id")
              ? false
              : getChatSession.isLoading
          }
          updateSearchParam={handleSearchParamChange}
          chatSession={getChatSession.data}
          askAiMutation={askAi}
          isAskAiMutationLoading={isAskAiLoading.loading}
          userId={getUser?.data?.id}
          TopBar={
            <TopBarWrapper className="w-full py-2 px-4 flex items-center justify-between">
              <Heading>{l("Chat")}</Heading>
              <Box className="flex gap-2">
                <IconButton
                  variant="surface"
                  className="cursor-pointer"
                  onClick={() => setIsSettingsModalOpen((prev) => !prev)}
                >
                  <SettingsIcon size="16px" />
                </IconButton>
                <IconButton
                  variant="surface"
                  className="cursor-pointer"
                  onClick={() => setIsFilesSidebarOpen((prev) => !prev)}
                  asChild
                >
                  <Link href="/me/bots">
                    <BrainIcon size="16px" />
                  </Link>
                </IconButton>
                <IconButton
                  variant="surface"
                  className="cursor-pointer"
                  onClick={() => setIsChatSidebarOpen((prev) => !prev)}
                >
                  <MessageSquareTextIcon size="16px" />
                </IconButton>

                {/* <IconButton
                  variant="surface"
                  className="cursor-pointer"
                  onClick={() => setIsFilesSidebarOpen((prev) => !prev)}
                >
                  <FolderOpenIcon size="16px" />
                </IconButton> */}
              </Box>
            </TopBarWrapper>
          }
        />
        {/* <FilesSidebar
          isOpen={isFilesSidebarOpen}
          setIsOpen={setIsFilesSidebarOpen}
          userId={getUser?.data?.id}
          updateSearchParam={handleSearchParamChange}
          askAiMutation={askAi}
          user={getUser.data}
        /> */}
      </Flex>
    </Box>
  );
}
