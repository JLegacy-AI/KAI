import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import TrpcProvider from "./_trpc/Provider";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "react-hot-toast";
import { EdgeStoreProvider } from "@/lib/edgestore/edgestore";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KAI",
  description: "Knowledge AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="module"
          src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js"
        ></script>
      </head>
      <body className={inter.className}>
        <EdgeStoreProvider>
          <TrpcProvider>
            <Theme accentColor="blue">
              {/* <div className="absoluter z-10 top-0 left-0">
                <TranslationButton />
              </div> */}
              <section className="w-screen h-screen">{children}</section>
            </Theme>
            <Toaster />
          </TrpcProvider>
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
