import Navbar from "./_components/Navbar";
import { Box } from "@radix-ui/themes";

export default function BotsLayout({children}) {
    return (
        <Box className="w-full h-full flex flex-col overflow-hidden">
            <Navbar />
            <Box className="flex-1 w-full h-full bg-gray-50 overflow-y-auto">
                {children}
            </Box>
        </Box>
    )
}