import { Spinner } from "@radix-ui/themes";
import CircleSpinner from "./CircleSpinner";


export default function FullScreenSpinner() {
  return (
    <section className="w-screen h-screen flex items-center justify-center">
        {/* <CircleSpinner size="36px" /> */}
        <Spinner size="3" />
    </section>
  );
}
