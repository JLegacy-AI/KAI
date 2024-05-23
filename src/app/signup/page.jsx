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
import { useEffect, useState } from "react";
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

  /*
  const handleLogin = async () => {
    // e.preventDefault();
    // Validation
    if (!password) return setError(l("Password is required"));
    setError("");
    setIsSubmitting(true);
    try {
      const result = await adminLogin.mutateAsync({ password });
      persistAdminToken(result.token);
      toast.success(result.message);
      // Redirect to admin dashboard
      router.push("/admin");
    } catch (error) {
      console.log("Error: ", error.data.httpStatus, error.message);
      setError(error.message);
    }

    setIsSubmitting(false);
  };
  */

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
      console.log("validation Errors: ", errors);
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
              {l("User Signup")}
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
                {l("Signup")}
              </Button>
            </form>
          </Card>
          <Text className="mt-2 text-gray-600" >{l("Already have an account")} <Link href="/login" className="text-blue-600 underline">{l("login")}</Link></Text>
        </Flex>
      </Container>
    </Section>
  );
}
