"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import { trpc } from "./client";

export default function TrpcProvider({ children }) {


  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() => {
    let basePath = "http://localhost:3000";
    if(global && global?.window?.location?.origin) basePath = global.window.location.origin;
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: `${basePath}/api/trpc`,
          /*
          headers() {
            return {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            };
          },
          */
        }),
      ],
    });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
