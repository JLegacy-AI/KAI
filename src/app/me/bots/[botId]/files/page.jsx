"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Flex,
  Heading,
  Tabs,
  Spinner,
  Text,
  Button,
  DropdownMenu,
} from "@radix-ui/themes";
import UploadFilesTab from "@/app/me/_components/UploadFilesTab";
import { trpc } from "@/app/_trpc/client";
import { EllipsisVerticalIcon, FileIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useEdgeStore } from "@/lib/edgestore/edgestore";

export default function BotFilesPage({ params }) {
  const router = useRouter();
  const { botId } = params;
  const { edgestore } = useEdgeStore(); 
  const getUser = trpc.user.get.useQuery(undefined);
  const getBotFiles = trpc.user.getBotFiles.useQuery(
    {
      botId: botId,
    },
    {
      onSuccess: (data) => {
        console.log("[getBotFiles] Data: ", data);
      },
    }
  );

  function getAvailableTokens() {
    const avbTokens = getUser?.data?.tokensGranted - getUser?.data?.tokensUsed;
    return avbTokens || 0;
  }

  async function handleDeleteFile(fileUrl) {
    try {
      await edgestore.userKbFiles.delete({ url: fileUrl });
      toast.success("File deleted successfully");
      getBotFiles.refetch();
    } catch (err) {
      toast.error(`Failed to delete file because ${err.message}`);
      console.log("[error@handleDeleteFiles]: ", err.message);
    }
  }

  return (
    <Box className="p-6">
      <Tabs.Root defaultValue="view">
        <Tabs.List>
          <Tabs.Trigger value="view">View Files</Tabs.Trigger>
          <Tabs.Trigger value="upload">Upload Files</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="view">
          <Box className="w-full py-4">
            {getBotFiles?.isLoading ? (
              <Flex className="w-full h-full items-center justify-center py-4">
                <Spinner />
              </Flex>
            ) : getBotFiles?.data?.data?.length > 0 ? (
              getBotFiles?.data?.data?.map((file, idx) => (
                <Box className="bg-white p-3 w-fit rounded flex flex-col items-center relative gap-1">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="absolute top-1 right-1 cursor-pointer text-gray-700">
                      <EllipsisVerticalIcon size="16" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content size="1">
                      <DropdownMenu.Item
                        onSelect={() => handleDeleteFile(file.url)}
                      >
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                  <FileIcon size="36" className="text-gray-500" />
                  <Text size="2">{file.metadata.name}</Text>
                </Box>
              ))
            ) : (
              <Text className="w-full text-center py-4" as="p">
                No files found
              </Text>
            )}
          </Box>
        </Tabs.Content>
        <Tabs.Content value="upload">
          <UploadFilesTab
            fileBucketName="userKbFiles"
            tokensAvailable={getAvailableTokens()}
            moreInput={{
              botId: botId,
            }}
          />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
