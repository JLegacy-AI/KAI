import HomePage from "./_components/HomePage";
import { Heading, Button } from "@radix-ui/themes";
import Link from "next/link";

export default function Home() {
  return <HomePage />
  return (
    <main className="h-screen w-screen overlfow-y-auto bg-white text-black flex flex-col items-center justify-center">
      <Heading size="9">KAI</Heading>
      <Button>
        <Link href="/login">Get Started</Link>
      </Button>
    </main>
  );
}
