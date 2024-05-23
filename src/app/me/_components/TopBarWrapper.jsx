import { Box } from "@radix-ui/themes";
import { twMerge } from "tailwind-merge";

export default function TopBarWrapper({ children, className }) {
  return (
    <Box className={twMerge("w-full h-[60px] min-h-[60px] border-b border-slate-300", className)}>
      {children}
    </Box>
  );
}
