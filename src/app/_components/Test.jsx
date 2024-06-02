"use client";

import { Button } from "@radix-ui/themes";
import { trpc } from "@/app/_trpc/client";

export default function Test() {
  const getHi = trpc.sayhi.useQuery(undefined, {
    onSuccess: (data) => {
      console.log("[getHi]: ", data);
    },
  });

  return (
    <div>
      <p>TRPC: {getHi.data}</p>
      <Button>Lets Go!</Button>
    </div>
  );
}
