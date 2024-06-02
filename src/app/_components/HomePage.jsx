import Link from "next/link";
import {
  BotIcon,
  FerrisWheelIcon,
  FolderSearchIcon,
  LinkIcon,
  MessageCircle,
  WalletCardsIcon,
} from "lucide-react";

const features = [
  {
    icon: <BotIcon size="30" />,
    title: "Custom Bot Creation",
    description:
      "Easily create and personalize multiple bots with unique names, descriptions, and prompts to suit your specific needs.",
  },
  {
    icon: <FolderSearchIcon size="30" />,
    title: "Domain-Specific Training",
    description:
      "Upload files to train your bots on specialized data, leveraging RAG technology for accurate and relevant responses.",
  },
  {
    icon: <FerrisWheelIcon size="30" />,
    title: "Wide Model Selection",
    description:
      "Choose from over 50 large language models, ranging from small to large, to optimize your bot's performance and insights.",
  },
  {
    icon: <MessageCircle size="30" />,
    title: "Intuitive Chat Interface",
    description:
      "Enjoy a user-friendly interface that simplifies creating multiple chat sessions and interacting with your custom bots.",
  },
  {
    icon: <LinkIcon size="30" />,
    title: "Easy Sharing",
    description:
      "Share your tailored bots effortlessly with others, expanding their utility and reach.",
  },
  {
    icon: <WalletCardsIcon size="30" />,
    title: "Payment Integration",
    description:
      "Seamlessly manage payments with integrated Stripe support, making transactions smooth and hassle-free.",
  },
];

export default function HomePage() {
  return (
    <section
      className="w-full h-full text-black bg-grid bg-gray-50 relative flex flex-col"
      style={{ backgroundSize: "2.5rem 2.5rem" }}
    >
      <nav className="container py-6 px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-600">KAI</h1>
        <div className="flex items-center gap-6">
          <Link href="/signup" className="text-gray-600 hover:text-gray-800">
            Signup
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-800">
            Login
          </Link>
        </div>
      </nav>
      <div className="flex-1 overflow-y-auto">
        <div className="w-full h-full flex flex-col items-center justify-center text-center container">
          <div className="w-full p-4 flex flex-col items-center justify-center">
            <p className="font-bold md:text-lg text-gray-500 tracking-wider uppercase">
              Domain Specific
            </p>
            <h2 className="text-5xl md:text-7xl py-2 black-gradient bg-clip-text text-transparent h-fit font-bold">
              Knowledge AI
            </h2>
            <div className="w-full sm:max-w-[500px] py-4">
              <spline-viewer
                url="https://prod.spline.design/Og15N1o4VV3zk1jd/scene.splinecode"
                width="100%"
                height="100%"
              ></spline-viewer>
            </div>
            <p className="py-2 text-xl md:text-2xl max-w-[500px] text-gray-400">
              Create specialized bots tailored to specific domains.
            </p>
            <button className="bg-gray-800 hover:bg-gray-900 text-white text-base md:text-lg px-3 py-2 rounded mt-4">
              <Link href={"/login"}>Get Started</Link>
            </button>
          </div>
        </div>
        <div className="w-full h-full flex flex-col items-center mt-6">
          <h2 className="text-3xl md:text-5xl py-2 black-gradient bg-clip-text text-transparent h-fit font-bold">
            Features
          </h2>
          <div className="mt-6 grid grid-cols-3 gap-10">
            {features.map((f) => {
              return (
                <div className="flex flex-col gap-1 w-[300px] border p-6 rounded bg-gray-50 shadow-lg">
                  {f.icon}
                  <h4 className="font-bold text-xl">{f.title}</h4>
                  <p className="text-sm text-gray-600">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full p-4 text-center">
          <p className="text-base text-gray-600 font-bold">
            Knowledge AI © 2024
          </p>
        </div>
      </div>
    </section>
  );
}
