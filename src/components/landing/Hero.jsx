import { ArrowLeft } from "lucide-react";
import image from "../../../public/assets/hero.png";
import Link from "next/link";

const Hero = () => {
  return (
    <>
      <div className="flex flex-col gap-4 justify-center items-center my-10 px-2 ">
        <h5 className="text-[48px] text-center">
          שינוי משפטי
          <br />
          מתאמן עם AI
        </h5>
        <p className="text-center">
          גלה ניהול, ניתוח וסיוע של מסמכים משפטיים חלקים.
        </p>
        <div className="flex flex-row-reverse gap-4  font-semibold">
          <Link href="/signup">
            <button
              type="button"
              className="bg-[#473BF0] text-white rounded-md px-4 py-2 flex gap-4 border-2 border-[#473BF0] hover:bg-white hover:text-[#473BF0]"
            >
              <ArrowLeft /> התחל בחינם
            </button>
          </Link>
          <button
            type="button"
            className="bg-white text-[#473BF0] rounded-md px-4 py-2 border-2 border-[#473BF0] hover:bg-[#473BF0] hover:text-white"
          >
            למד עוד
          </button>
        </div>
      </div>
      <img className="mx-auto my-10" src={image} alt="" />
    </>
  );
};

export default Hero;
