"use client";

import { trpc } from "@/app/_trpc/client";
import { Box, Button, Flex, Heading, Table } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore/edgestore";
import toast from "react-hot-toast";

export default function UsersTrackingPage() {
  const adminLogout = trpc.admin.logout.useMutation();
  const { reset: resetEdgeStoreContext } = useEdgeStore();
  const router = useRouter();
  const getUsers = trpc.admin.getUsers.useQuery(undefined, {
    onSuccess: (data) => {
      console.log("[getUsers] Data: ", data);
    },
  });
  const disableUserAccount = trpc.admin.disableUserAccount.useMutation({
    onSuccess: (data) => {
      getUsers?.refetch();
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  async function handleLogout() {
    await adminLogout.mutateAsync();
    await resetEdgeStoreContext();

    router.replace("/admin-login");
    router.refresh();
  }

  return (
    <Flex className="w-full h-full flex-col gap-3">
      <Box className="flex items-center justify-between">
        <Heading>Users</Heading>
        <Button onClick={handleLogout}>Logout</Button>
      </Box>
      <Box className="w-full h-full flex-1">
        <Table.Root className="w-full h-full bg-white rounded">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Tokens Granted</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Tokens Used</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Total Tokens Used</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {getUsers?.data?.map((udata, idx) => {
              return (
                <Table.Row key={idx}>
                  <Table.RowHeaderCell className="text-xs text-gray-600">
                    {udata.id}
                  </Table.RowHeaderCell>
                  <Table.Cell className="capitalize">{udata.name}</Table.Cell>
                  <Table.Cell>{udata.email}</Table.Cell>
                  <Table.Cell>
                    {new Intl.NumberFormat().format(udata.tokensGranted || 0)}
                  </Table.Cell>
                  <Table.Cell>
                    {new Intl.NumberFormat().format(udata.tokensUsed || 0)}
                  </Table.Cell>
                  <Table.Cell>
                    {new Intl.NumberFormat().format(udata.totalTokensUsed || 0)}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      className={
                        udata.isAccountDisabled
                          ? "bg-red-600 text-white "
                          : "bg-green-600 text-white"
                      }
                      size="1"
                      onClick={() =>
                        disableUserAccount.mutate({
                          userId: udata.id,
                          isAccountDisabled: !udata.isAccountDisabled,
                        })
                      }
                    >
                      {udata.isAccountDisabled ? "Enable" : "Disable"}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>
    </Flex>
  );
}
