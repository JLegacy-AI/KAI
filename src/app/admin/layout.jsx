import { Box, Grid, Flex, Spinner } from "@radix-ui/themes";
import Sidebar from "./_components/Sidebar";
import { Suspense } from "react";

export default function Layout({ children }) {
  return (
    <Suspense
      fallback={
        <Box className="w-full h-full flex items-center justify-center">
          <Spinner />
        </Box>
      }
    >
      <Box
        className="w-full h-full grid bg-[color:var(--gray-3)]"
        // style={{ backgroundColor: "var(--gray-a2)" }}
      >
        <Flex className="w-full h-full overflow-hidden">
          {/* <Sidebar /> */}
          <Box className="w-full flex-grow p-4">{children}</Box>
        </Flex>
      </Box>
    </Suspense>
  );
}
