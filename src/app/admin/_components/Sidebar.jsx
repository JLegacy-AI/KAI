"use client";

import { Box, Flex, Card, Button, IconButton, Text } from "@radix-ui/themes";
import { Book, Ghost, XIcon, ArrowRightIcon, User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { useEffect } from "react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useEdgeStore } from "@/lib/edgestore/edgestore";

const tabLinks = [
  {
    title: "Users",
    icon:  User2Icon,
    href: "/admin",
  }
];

export default function Sidebar() {
  const router = useRouter();
  const adminLogout = trpc.admin.logout.useMutation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { reset: resetEdgeStoreContext } = useEdgeStore();

  async function handleLogout() {
    await adminLogout.mutateAsync();
    await resetEdgeStoreContext();

    router.replace("/admin-login");
    router.refresh();
  }

  useEffect(() => {
    if (typeof window !== undefined) {
      setIsSidebarOpen(window.innerWidth > 1024);
    }
  }, []);

  useEffect(() => {
    console.log("Is Sidebar Open: ", isSidebarOpen);
  }, [isSidebarOpen]);

  return (
    <>
      {!isSidebarOpen && (
        <Box className="absolute bottom-14 left-8 z-20">
          <IconButton
            size="1"
            className="cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <ArrowRightIcon size="16" />
          </IconButton>
        </Box>
      )}
      <Box
        className={twMerge(
          "w-[360px] min-w-[360px] h-full p-4 transition absolute md:relative z-10",
          isSidebarOpen ? "block" : "hidden",
        )}
      >
        <Card className="w-full h-full p-4 flex flex-col gap-2">
          <Box className="flex-1 flex flex-col gap-2">
            <Flex className="w-full justify-end items-center">
              <IconButton
                size="1"
                variant="ghost"
                className="cursor-pointer block md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <XIcon size="16" />
              </IconButton>
            </Flex>
            {tabLinks?.map((tlink, idx) => {
              return (
                <Card
                  key={idx}
                  className="border-none flex bg-gray-100 p-3 rounded-md gap-3 items-center cursor-pointer hover:bg-gray-200 transition-color"
                  onClick={() => router.push(tlink.href)}
                >
                  {tlink.icon && <tlink.icon />}
                  {tlink.title}
                </Card>
              );
            })}
          </Box>
          <Box>
            <Button className="cursor-pointer w-full" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  );
}
