"use client";

import { trpc } from "@/app/_trpc/client";
import {
  Box,
  Spinner,
  Card,
  Text,
  Select,
  Flex,
  IconButton,
  DropdownMenu,
  AlertDialog,
  Button,
} from "@radix-ui/themes";
import { FileIcon } from "lucide-react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { l } from "@/lib/language";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore/edgestore";

export default function ViewFilesTab({
  fileBucketName,
  getQueryName,
  categories,
  moreInput,
}) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { edgestore } = useEdgeStore();
  const filesQuery = trpc.admin[getQueryName].useQuery(
    {
      category: searchParams.get("category")
        ? searchParams.get("category")
        : undefined,
      ...(moreInput ?? {}),
    },
    {
      onSuccess: (data) => {
        console.log("Data: ", data);
      },
    }
  );

  function handleSearchParamChange(key, value) {
    if (!key) return;

    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    replace(`${pathname}?${params.toString()}`);
  }

  async function handleDeleteFile(url) {
    const res = await edgestore[fileBucketName].delete({
      url,
    });
    await filesQuery.refetch();
    // console.log("[ViewFilesTab-handleDeleteFile]: ", res);
  }

  return (
    <Box className="w-full px-2">
      <Flex className="gap-2 mb-4">
        <Text size="2">Filters: </Text>
        <Select.Root
          defaultValue={
            searchParams.get("category")
              ? searchParams.get("category")
              : undefined
          }
          size="1"
          onValueChange={(val) => {
            handleSearchParamChange("category", val);
          }}
        >
          <Select.Trigger placeholder="Category" />
          <Select.Content>
            <Select.Group>
              {categories?.map((cat, idx) => (
                <Select.Item value={cat.value} key={idx}>
                  {cat.label}
                </Select.Item>
              ))}
              <Select.Item value={undefined}> All</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Flex>
      {filesQuery?.data?.data ? (
        <Box className="flex flex-wrap gap-3 text-gray-700">
          {filesQuery.data?.data?.length === 0 ? (
            <Text className="text-center w-full">No Files Found</Text>
          ) : (
            filesQuery.data?.data?.map((fileData) => (
              <Card
                className="flex flex-col items-center w-[100px] max-w-[100px] text-center"
                key={fileData.url}
              >
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <IconButton
                      variant="ghost"
                      size="1"
                      className="absolute top-2 right-1 hover:bg-transparent cursor-pointer"
                    >
                      <DotsVerticalIcon />
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content size="1">
                    <DropdownMenu.Item
                      onClick={() => handleDeleteFile(fileData.url)}
                    >
                      Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
                <FileIcon size="36px" className="mb-1" />
                <Text size="1" className="w-full" wrap="nowrap" truncate={true}>
                  {fileData.metadata.name}
                </Text>
                <Text size="1" className="w-full text-gray-500">
                  {fileData.metadata.category}
                </Text>
              </Card>
            ))
          )}
        </Box>
      ) : (
        <div className="w-full flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </Box>
  );
}
