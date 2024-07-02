"use client";

import { Flex, Heading, Box, Text, Button } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { useEdgeStore } from "@/lib/edgestore/edgestore";

const links = [
  {
    title: "Chat",
    href: "/me",
  },
  {
    title: "Create Bot",
    href: "/me/bots/create",
  },
  {
    title: "View Bots",
    href: "/me/bots",
  },
  {
    title: "Community",
    href: "/me/bots/community",
  },
];

export default function Navbar() {
  const router = useRouter();
  const userLogout = trpc.user.logout.useMutation();
  const { reset: resetEdgeStoreContext } = useEdgeStore();

  async function handleLogout() {
    await userLogout.mutateAsync();
    await resetEdgeStoreContext();

    router.replace("/login");
    router.refresh();
  }

  return (
    <Box className="w-full bg-white border-b">
      <Flex className="w-full p-4 justify-between items-center container">
        <Heading className="text-2xl">Knowledge AI</Heading>
        <Flex className="gap-6 items-center">
          {links.map((link) => (
            <Button variant="ghost" size="3" key={link.href} asChild>
              <Link href={link.href}>{link.title}</Link>
            </Button>
          ))}
          <Button variant="" size="2" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
