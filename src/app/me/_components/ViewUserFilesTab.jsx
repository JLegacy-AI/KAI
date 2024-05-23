"use client";

import { twMerge } from "tailwind-merge";
import {
  Select,
  Box,
  Flex,
  Heading,
  Text,
  DropdownMenu,
  Spinner,
  Card,
  IconButton,
  Checkbox,
  ScrollArea,
  Button,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { FileIcon } from "lucide-react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useEdgeStore } from "@/lib/edgestore/edgestore";
import toast from "react-hot-toast";
import { l } from "@/lib/language";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { createDisplayMessage  } from "../utils";
import { layoutDir } from "@/lib/globals";

export default function ViewUserFilesTab({
  className,
  fileCategories,
  files,
  filesError,
  selectedFilesState,
  selectedCategoryState,
  onDeleteFile,
  updateSearchParam,
  askAiMutation,
}) {
  const [selectedCategory, setSelectedCategory] = selectedCategoryState;
  const [selectedFiles, setSelectedFiles] = selectedFilesState; // Stores only file ids
  const [fileToRewrite, setFileToRewrite] = useState(null); // opens the entity modal when a file is selected
  const searchParams = useSearchParams();
  const { edgestore } = useEdgeStore();

  async function handleDeleteFile(fileUrl) {
    try {
      await edgestore.userLegalKbFiles.delete({ url: fileUrl });
      toast.success(`${l("File deleted successfully")}`);
      // Do whatever you want to do after deleting the files, probably refetch the files
      await onDeleteFile(fileUrl);
    } catch (err) {
      toast.error(`${l("Failed to delete file because")} ${err.message}`);
      console.log("[error@handleDeleteFiles]: ", err.message);
    }
  }

  function handleSelectFile(fileId) {
    setSelectedFiles((prev) => {
      if (prev.includes(fileId)) {
        return prev.filter((id) => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  }

  function isFileSelected(fileId) {
    return selectedFiles.includes(fileId);
  }

  async function handleSummarizeFile(fileData) {
    const queryInput = {
      file: {
        name: fileData.metadata.name,
        url: fileData.url,
      },
    };

    askAiMutation.mutate({
      chatSessionId: searchParams.get("chat_session_id") || "new",
      queryType: "summarize",
      displayMessage: createDisplayMessage("summarize", queryInput),
      summarize: queryInput,
    });
  }

  async function handleExplainFile(fileData) {
    const queryInput = {
      file: {
        name: fileData.metadata.name,
        url: fileData.url,
      },
    };

    askAiMutation.mutate({
      chatSessionId: searchParams.get("chat_session_id") || "new",
      queryType: "explain",
      displayMessage: createDisplayMessage("explain", queryInput),
      explain: queryInput,
    });
  }

  async function handleCompareFiles(filesData) {
    const queryInput = {
      files: filesData.map((fd) => ({ name: fd.metadata.name, url: fd.url })),
    };

    askAiMutation.mutate({
      chatSessionId: searchParams.get("chat_session_id") || "new",
      queryType: "compare",
      displayMessage: createDisplayMessage("compare", queryInput),
      compare: queryInput,
    });
  }

  async function handleRewriteFile(fileData, entityData) {
    const queryInput = {
      file: {
        name: fileData.metadata.name,
        url: fileData.url,
      },
      entity: {
        name: entityData.name,
        type: entityData.type,
        personality: entityData.personality,
      },
    };

    askAiMutation.mutate({
      chatSessionId: searchParams.get("chat_session_id") || "new",
      queryType: "rewrite",
      displayMessage: createDisplayMessage("rewrite", queryInput),
      rewrite: queryInput,
    });
  }

  return (
    <Box className={twMerge("w-full h-full", className)}>
      {/* <EntityDetailDialog
        isOpen={!!fileToRewrite}
        setIsOpen={(val) => setFileToRewrite(null)}
        onSubmit={(entity) => handleRewriteFile(fileToRewrite, entity)}
      /> */}
      {fileCategories && (
        <Flex className="flex-col p-2 border-b border-gray-300">
          <Flex className="justify-between items-center gap-2">
            <Box>
              <Select.Root
                defaultValue={selectedCategory?.value}
                size="1"
                onValueChange={(val) => {
                  setSelectedCategory(
                    fileCategories.find((cat) => cat.value === val)
                  );
                }}
              >
                <Select.Trigger placeholder={l("Category")} />
                <Select.Content>
                  <Select.Group>
                    {fileCategories?.map((cat, idx) => (
                      <Select.Item value={cat.value} key={idx}>
                        {cat.label}
                      </Select.Item>
                    ))}
                    <Select.Item value={undefined}>{l("All")}</Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </Box>
            {selectedFiles?.length > 1 && (
              <Box className="flex gap-2">
                <Button
                  size="1"
                  variant="surface"
                  className="cursor-pointer"
                  onClick={() =>
                    handleCompareFiles(
                      files.filter((f) => selectedFiles.includes(f.metadata.id))
                    )
                  }
                >
                  Compare
                </Button>
                <Button
                  size="1"
                  variant="surface"
                  className="cursor-pointer"
                  onClick={() => setSelectedFiles([])}
                >
                  Unselect All
                </Button>
              </Box>
            )}
          </Flex>
        </Flex>
      )}
      {files ? (
        <ScrollArea
          scrollbars="vertical"
          className="flex flex-wrap text-gray-700"
        >
          {files.length === 0 ? (
            <Text className="text-center w-full p-3" as="p">
              No Files Found
            </Text>
          ) : (
            files?.map((fileData, idx) => (
              <Box
                key={idx}
                className={`w-full border-b flex items-center px-3 py-2 border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  isFileSelected(fileData.metadata.id)
                    ? "bg-gray-100"
                    : "bg-white"
                }`}
                onClick={() => handleSelectFile(fileData.metadata.id)}
                dir={layoutDir}
              >
                <FileIcon
                  size="30px"
                  className="mr-2 min-w-[30px] text-gray-500"
                />

                <Flex className="w-full flex-col">
                  <Text
                    size="2"
                    as="p"
                    className="w-full truncate max-w-[150px]"
                  >
                    {fileData.metadata.name}
                  </Text>
                  
                  <Text size="1" as="p">
                  {new Date(fileData.uploadedAt).toLocaleDateString()} | {fileData.metadata.category}  
                  </Text>
                  <Text size="1" as="p">
                    
                  </Text>
                </Flex>
                {/* <Checkbox className="mx-2 cursor-pointer" variant="soft" /> */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <IconButton
                      size="1"
                      variant="ghost"
                      className="cursor-pointer"
                    >
                      <DotsVerticalIcon />
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content
                    size="1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu.Item asChild>
                      <a target="_blank" href={fileData.url}>
                        {l("View")}
                      </a>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onClick={() => handleExplainFile(fileData)}
                    >
                      {l("Explain")}
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onClick={() => handleSummarizeFile(fileData)}
                    >
                      {l("Summarize")}
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onClick={() => {
                        setFileToRewrite(fileData);
                      }}
                    >
                      {l("Rewrite")}
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onClick={() => {
                        handleDeleteFile(fileData.url);
                      }}
                    >
                      {l("Delete")}
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Box>
            ))
          )}
        </ScrollArea>
      ) : filesError ? (
        <Box className="w-full p-2 text-center">
          <Text className="w-full text-center" as="p" color="red" size="2">
            An error occured while fetching files
          </Text>
          <Text color="red" size="1">
            {filesError?.message}
          </Text>
        </Box>
      ) : (
        <Box className="w-full flex items-center justify-center p-2">
          <Spinner />
        </Box>
      )}
    </Box>
  );
}
