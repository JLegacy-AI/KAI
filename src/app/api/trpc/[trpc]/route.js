import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server";
import { createContext } from "./context";

// This is part of server side

const handler = (req) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext({ req }),
    onError: (opts) => {
      if (opts.error.code === "INTERNAL_SERVER_ERROR")
        console.error(`[error@${opts.path}]: `, opts.error);
    },
  });

export { handler as GET, handler as POST };
