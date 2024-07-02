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
import { userSignupSchema, getZodErrorsObj } from "@/lib/zodSchemas";
import { layoutDir } from "@/lib/globals";
import Link from "next/link";

const initialFormState = {
  name: { error: "" },
  email: { error: "" },
  password: { error: "", type: "password" },
  confirmPassword: { error: "", type: "password" },
};

export default function UserSignupPage() {
  const router = useRouter();
  const [inputs, setInputs] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userSignup = trpc.user.signup.useMutation();

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    const validationResult = userSignupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });
    setIsSubmitting(true);
    if (!validationResult.success) {
      const errors = getZodErrorsObj(validationResult.error.errors);
      const newInputs = { ...initialFormState };
      console.log("Validation Errors: ", errors);
      Object.keys(errors).forEach((key) => {
        newInputs[key] = {
          ...newInputs[key],
          error: errors[key],
        };
      });
      setInputs(newInputs);
      setIsSubmitting(false);
      return;
    }
    console.log("Validation Passed");
    setInputs(initialFormState);
    try {
      const result = await userSignup.mutateAsync({
        name,
        email,
        password,
        confirmPassword,
      });
      console.log("Signup Result: ", result);
      toast.success(result.message);
      router.push("/login");
    } catch (err) {
      console.log("Error: ", err.data.httpStatus, err.message);
      toast.error(err.message);
    }
    setIsSubmitting(false);
  }

  return (
    <Section
      height="100vh"
      style={{ backgroundColor: "var(--gray-a2)" }}
      dir={layoutDir}
    >
      <Container align="center" px="5" style={{ height: "100%" }} as="div">
        <Flex justify="center" align="center" style={{ height: "100%" }}>
          <Card
            style={{ width: "80%", height: "80%", padding: 0 }}
            className="flex flex-row"
          >
            <Box
              style={{
                flex: 2,
                background: "url('/assets/signup_.jpeg') center/cover",
              }}
            ></Box>
            <Box
              style={{
                flex: 1,
                padding: "50px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Heading align="center" my="20px">
                {l("Signup")}
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
                  className="cursor-pointer w-full text-white transition-all duration-200 rounded-md bg-black hover:bg-gray-300 hover:text-black px-4 py-2 min-w-[100px] text-center border-none outline-none"
                  type="submit"
                  loading={isSubmitting}
                >
                  {l("Signup")}
                </Button>
              </form>
              <Text className="mt-2 text-gray-600" align="center">
                {l("Already have an account?")}{" "}
                <Link href="/login" className="text-blue-600 underline">
                  {l("Login")}
                </Link>
              </Text>
            </Box>
          </Card>
        </Flex>
      </Container>
    </Section>
  );
}
