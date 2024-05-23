"use client";
import SidebarContainer from "./SidebarContainer";
import {
  Button,
  Heading,
  Flex,
  Box,
  Card,
  Text,
  Progress,
} from "@radix-ui/themes";
import { trpc } from "@/app/_trpc/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { XIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { Action } from "@radix-ui/themes/dist/cjs/components/alert-dialog";
import ActionAlertDialog from "./ActionAlertDialog";
import { getUsedTokensPercentage } from "../utils";
import { l } from "@/lib/language";
import { useEdgeStore } from "@/lib/edgestore/edgestore";

export default function ChatSidebar({
  className,
  isOpen,
  setIsOpen,
  chatSessions = [],
  user = {},
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userLogout = trpc.user.logout.useMutation();
  const deleteChatSession = trpc.user.deleteChatSession.useMutation();
  const { reset: resetEdgeStoreContext } = useEdgeStore();

  function handleSearchParamChange(key, value) {
    if (!key) return;

    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleClickChatSession(chatSessionId) {
    handleSearchParamChange("chat_session_id", chatSessionId);
  }

  function handleClickNewChatSession() {
    handleSearchParamChange("chat_session_id", null);
  }

  async function handleLogout() {
    await userLogout.mutateAsync();
    await resetEdgeStoreContext();

    router.replace("/login");
    router.refresh();
  }

  function isSessionActive(chatSessionId) {
    return searchParams.get("chat_session_id") === chatSessionId;
  }

  function handleDeleteChatSession(chatSessionId) {
    deleteChatSession.mutateAsync(
      { id: chatSessionId },
      {
        onSuccess: () => {
          // If the chat session being deleted is the active one, reset the search param
          toast.success(l("Chat session deleted successfully"));
          if (searchParams.get("chat_session_id") === chatSessionId) {
            handleSearchParamChange("chat_session_id", null);
          }
        },
      }
    );
  }

  return (
    <SidebarContainer
      className={className}
      side="left"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      TopBar={<Heading size="3">{l("Chat Sessions")}</Heading>}
    >
      <Flex className="flex flex-col gap-2 h-full p-2">
        <Box className="flex-1 flex flex-col gap-1 w-full">
          <Button
            className="w-full cursor-pointer"
            size="2"
            variant="surface"
            onClick={handleClickNewChatSession}
          >
            {l("New Chat Session")}
          </Button>
          {chatSessions.map((cs, idx) => {
            return (
              <Box
                key={idx}
                className={twMerge(
                  "w-full cursor-pointer bg-white hover:bg-gray-200 transition-colors rounded px-2 py-2 overflow-hidden flex items-center",
                  isSessionActive(cs.id) ? "bg-gray-100" : ""
                )}
                size="1"
                onClick={() => handleClickChatSession(cs.id)}
              >
                <Text className="w-full truncate" size="2" as="p">
                  {cs.title}
                </Text>
                {/* <ActionAlertDialog title="Delete Chat Session" description="Are you sure you want to delete the chat session?" actionLabel="Delete" onAction={() => console.log("Delete Chat Session")}> */}
                <XIcon
                  size="14px"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChatSession(cs.id);
                  }}
                />
              </Box>
            );
          })}
        </Box>
        <Box className="p-2 flex flex-col gap-2">
          {user && (
            <Box>
              <Text size="1">
                {user.tokensGranted}/{user.tokensUsed}
              </Text>
              <Progress
                value={getUsedTokensPercentage(
                  user.tokensGranted,
                  user.tokensUsed
                )}
              />
            </Box>
          )}
          <Button className="w-full cursor-pointer" onClick={handleLogout}>
            {l("Logout")}
          </Button>
        </Box>
      </Flex>
    </SidebarContainer>
  );
}
