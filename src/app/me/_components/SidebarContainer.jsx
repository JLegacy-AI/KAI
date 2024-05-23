"use client";
import { Box } from "@radix-ui/themes";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  GripVertical,
  XIcon,
} from "lucide-react";
import TopBarWrapper from "./TopBarWrapper";
import { IconButton } from "@radix-ui/themes";

function GripIcon({ side }) {
  return (
    <Box
      className={twMerge(
        "cursor-ew-resize py-1 bg-gray-200 w-fit h-fit rounded absolute top-[45%] -mx-[5px]",
        side == "left" ? "right-0" : "left-0"
      )}
    ></Box>
  );
}

export default function SidebarContainer({
  children,
  className,
  side = "left",
  isOpen,
  setIsOpen,
  TopBar,
  TopBarCloseButtonOptions = {}
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(isOpen);

  function toggleOpen() {
    const newOpenState = !isOpen;
    setIsSidebarOpen(newOpenState);
    setIsOpen(newOpenState);
  }

  useEffect(() => {
    setIsSidebarOpen(isOpen);
  }, [isOpen]);

  return (
    <Box
      className={twMerge(
        "bg-white z-10 h-full absolute lg:relative flex flex-col border-slate-300 transition-all duration-300 ease-out overflow-hidden",
        side == "left" ? "border-r left-0" : "border-l right-0",
        "border-r border-l", // For RTL
        isSidebarOpen ? "w-[300px]" : "w-[0px]",
        className
      )}
    >
      <TopBarWrapper className="flex items-center px-4 py-2">
        <Box className="flex-1 px-2">{TopBar}</Box>
        <IconButton
          size="1"
          variant="ghost"
          // color="gray"
          className="cursor-pointer"
          onClick={toggleOpen}
          {...TopBarCloseButtonOptions}
        >
          <XIcon size="18px" />
        </IconButton>
      </TopBarWrapper>
      <Box className={`flex-1 h-full w-full`}>{children}</Box>
    </Box>
  );
}
