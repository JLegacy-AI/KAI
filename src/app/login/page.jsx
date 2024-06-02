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
import { l } from "@/lib/language";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { userLoginSchema, getZodErrorsObj } from "@/lib/zodSchemas";
import { layoutDir } from "@/lib/globals";
import Link from "next/link";
import { useEdgeStore } from "@/lib/edgestore/edgestore";

const initialFormState = {
  email: { error: "" },
  password: { error: "", type: "password" },
};

export default function UserLoginPage() {
  const router = useRouter();
  const [inputs, setInputs] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { reset: resetEdgeStoreContext } = useEdgeStore();

  const userLogin = trpc.user.login.useMutation();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const validationResult = userLoginSchema.safeParse({
      email,
      password,
    });
    if (!validationResult.success) {
      const errors = getZodErrorsObj(validationResult.error.errors);
      const newInputs = { ...initialFormState };

      Object.keys(errors).forEach((key) => {
        newInputs[key] = {
          ...newInputs[key],
          error: errors[key],
        };
      });

      setInputs(newInputs);
      setIsSubmitting(false);
      return ;
    }
    setIsSubmitting(false);
    setInputs(initialFormState);

    try {
      const result = await userLogin.mutateAsync({ email, password });
      await resetEdgeStoreContext();
      toast.success(result.message);
      // Redirect to dashboard
      router.replace("/me");
      router.refresh(); // refresh the page, hence making sure the cookies and user data are updated
      console.log("Page Refreshed");
    } catch (error) {
      console.log("Error: ", error?.data?.httpStatus, error?.message);
      toast.error(error?.message);
    }
  }

  return (
    <Section height="100vh" style={{ backgroundColor: "var(--gray-a2)" }} dir={layoutDir}>
      <Container align="center" px="5" style={{ height: "100%" }} as="div">
        <Flex
          justify="center"
          align="center"
          direction="column"
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
              {l("User Login")}
            </Heading>
            <form onSubmit={handleSubmit}>
              {inputs &&
                Object.keys(inputs).map((key, idx) => (
                  <Box my="10px" key={idx}>
                    <TextField.Root
                      name={key}
                      placeholder={l(key)}
                      type={inputs[key].type || "text"}
                    />
                    {inputs[key].error && (
                      <Text size="1" color="red">
                        {inputs[key].error}
                      </Text>
                    )}
                  </Box>
                ))}
              <Button
                variant="classic"
                className="cursor-pointer w-full"
                // onClick={handleLogin}
                type="submit"
                loading={isSubmitting}
              >
                {l("Login")}
              </Button>
            </form>
          </Card>
          <Text className="mt-2 text-gray-600" >{l("Do not have an account")} <Link href="/signup" className="text-blue-600 underline">{l("Signup")}</Link></Text>
        </Flex>
      </Container>
    </Section>
  );
}
