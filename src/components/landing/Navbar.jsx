'use client'
import { useState } from "react";
import { Menu } from 'lucide-react';


const Navbar = () => {
    const [mobile, setMobile] = useState(false)

    return (
        <>
            <div className="flex flex-row-reverse justify-between  items-center h-20  px-2 md:px-10">
                <h2 className="text-[24px] font-bold">עורך דין AI</h2>
                <Menu  onClick={() => setMobile(!mobile) } className="visible md:hidden" />


                {/* wied screen */}
                <div className="hidden md:flex flex-row-reverse gap-4">
                    <div className="flex flex-row-reverse gap-4 border-l pl-8 ml-6 font-semibold items-center">
                        <a className="cursor-pointer" >מאפיינים</a>
                        <a className="cursor-pointer" >תמחור</a>
                        <a className="cursor-pointer" >תמיכה</a>
                        <a className="cursor-pointer" >למה לנו?</a>

                    </div>
                    <div className="flex flex-row-reverse gap-4 font-semibold">
                        <button type="button" className="bg-[#473BF0] text-white rounded-md px-4 py-2 hover:bg-white hover:text-[#473BF0]">להתחבר</button>
                        <button type="button" className="bg-white text-[#473BF0] rounded-md px-4 py-2 hover:bg-[#473BF0] hover:text-white">להתחבר</button>

                    </div>
                </div>


                {/* mobile  */}
                {mobile &&
                    <div className="absolute md:hidden top-16 left-0 ps-5 gap-4 w-full flex flex-col items-start bg-slate-600 bg-opacity-40 py-4">
                        <div className="flex flex-col gap-4  font-semibold items-start">
                            <a className="cursor-pointer" >מאפיינים</a>
                            <a className="cursor-pointer" >תמחור</a>
                            <a className="cursor-pointer" >תמיכה</a>
                            <a className="cursor-pointer" >למה לנו?</a>

                        </div>
                        <div className="flex flex-col gap-4 font-semibold">
                            <button type="button" className="bg-[#473BF0] text-white rounded-md px-4 py-2 hover:bg-white hover:text-[#473BF0]">להתחבר</button>
                            <button type="button" className="bg-white text-[#473BF0] rounded-md px-4 py-2 hover:bg-[#473BF0] hover:text-white">להתחבר</button>

                        </div>
                    </div>
                }

            </div>
        </>
    )
}


export default Navbar;