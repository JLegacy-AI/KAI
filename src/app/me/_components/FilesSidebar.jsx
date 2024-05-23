"use client";

import UploadFilesTab from "./UploadFilesTab";
import SidebarContainer from "./SidebarContainer";
import {
  Heading,
  Box,
  Text,
  Spinner,
  IconButton,
  Flex,
  Tooltip,
} from "@radix-ui/themes";
import { useEffect } from "react";
import { trpc } from "@/app/_trpc/client";
import { FileStack, UploadIcon } from "lucide-react";
import { l } from "@/lib/language";
import { useState } from "react";
import ViewUserFilesTab from "./ViewUserFilesTab";

const fileCategories = [
  { label: l("Legal"), value: "legal" },
  { label: l("Illegal"), value: "illegal" },
  { label: l("Fair"), value: "fair" },
];

export default function FilesSidebar({
  className,
  isOpen,
  setIsOpen,
  updateSearchParam,
  askAiMutation,
  user,
}) {
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const getUserFiles = trpc.user.getLegalKbFiles.useQuery(
    {
      category: selectedCategory?.value,
    },
    {
      onSuccess: (data) => {
        console.log("[getUserFiles] Data:", data);
      },
    }
  );
  const [tab, setTab] = useState("view-files"); // "upload-files" | "view-files"
  const [selectedFiles, setSelectedFiles] = useState([]); // used in ViewUserFilesTab for tracking selected files

  useEffect(() => {
    // Refetch user files when tab is changed to "view-files"
    if (tab === "view-files") getUserFiles.refetch();
  }, [tab]);

  return (
    <SidebarContainer
      className={className}
      side="right"
      TopBar={
        <Box className="flex justify-between items-center mr-2">
          <Heading size="3">{l("Files")}</Heading>
          <Flex className="gap-2 items-center">
            <Tooltip content={l("View Files")}>
              <IconButton
                variant="surface"
                size="1"
                className="cursor-pointer"
                onClick={() => setTab("view-files")}
              >
                <FileStack size="16px" />
              </IconButton>
            </Tooltip>
            <Tooltip content={l("Upload Files")}>
              <IconButton
                variant="surface"
                size="1"
                className="cursor-pointer"
                onClick={() => setTab("upload-files")}
              >
                <UploadIcon size="16px" />
              </IconButton>
            </Tooltip>
          </Flex>
        </Box>
      }
      TopBarCloseButtonOptions={{ variant: "surface" }}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {tab === "upload-files" &&
        (user ? (
          <Box className="w-full h-full p-2">
            <Text size="2" color="gray" as="p">
              {l("Upload files to knowledge base")}
            </Text>
            <UploadFilesTab
              fileBucketName={"userLegalKbFiles"}
              fileCategories={fileCategories}
              uploadBy="user"
              tokensAvailable={user.tokensGranted - user.tokensUsed}
            />
          </Box>
        ) : (
          <Spinner />
        ))}
      {tab === "view-files" && (
        <ViewUserFilesTab
          fileCategories={fileCategories}
          selectedCategoryState={[selectedCategory, setSelectedCategory]}
          files={getUserFiles?.data?.data}
          filesError={getUserFiles.error}
          selectedFilesState={[selectedFiles, setSelectedFiles]}
          onDeleteFile={async (fileUrl) => {
            getUserFiles.refetch();
          }}
          updateSearchParam={updateSearchParam}
          askAiMutation={askAiMutation}
        />
      )}
    </SidebarContainer>
  );
}
