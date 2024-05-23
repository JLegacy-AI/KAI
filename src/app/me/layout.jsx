import React, { Suspense } from "react";
import { Box, Spinner } from "@radix-ui/themes";

export default function Layout({ children }) {
  return (
    <Suspense
      fallback={
        <Box className="w-full h-full flex items-center justify-center">
          <Spinner />
        </Box>
      }
    >
        {children}
    </Suspense>
  );
}
