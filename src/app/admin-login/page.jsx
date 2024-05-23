"use client";

import {
  Section,
  Container,
  Heading,
  TextField,
  Card,
  Flex,
  Button,
  Text,
  Box,
} from "@radix-ui/themes";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore/edgestore";
import { TRPCClientError } from "@trpc/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { reset: resetEdgeStoreContext } = useEdgeStore();

  const adminLogin = trpc.admin.login.useMutation();

  const handleLogin = async () => {
    // e.preventDefault();
    // Validation
    if (!password) return setError(l("Password is required"));
    setError("");
    setIsSubmitting(true);
    try {
      const result = await adminLogin.mutateAsync({ password });
      await resetEdgeStoreContext();
      toast.success(result.message);
      // Redirect to admin dashboard
      router.replace("/admin");
      router.refresh();
    } catch (error) {
      if(error instanceof TRPCClientError)
      console.log("Error: ", error.data.httpStatus, error.message);
      setError(error.message);
    }

    setIsSubmitting(false);
  };

  return (
    <Section height="100vh" style={{ backgroundColor: "var(--gray-a2)" }}>
      <Container align="center" px="5" style={{ height: "100%" }} as="div">
        <Flex
          justify="center"
          align="center"
          style={{ height: "100%" }}
          className="h-full"
        >
          <Card
            style={{ width: "350px" }}
            p="50px"
            className="p-6"
            variant="classic"
          >
            <Heading align="center" my="20px">
              Admin Login
            </Heading>
            {/* <TextField.Root placeholder="Admin" value="Admin" disabled /> */}
            <Box my="10px">
              <TextField.Root
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              {error && (
                <Text size="1" color="red">
                  {error}
                </Text>
              )}
            </Box>
            <Button
              variant="classic"
              className="cursor-pointer w-full"
              onClick={handleLogin}
              loading={isSubmitting}
            >
              Login
            </Button>
          </Card>
        </Flex>
      </Container>
    </Section>
  );
}
