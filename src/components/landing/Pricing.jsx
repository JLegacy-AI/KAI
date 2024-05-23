'use client'
import { useState } from "react";
import PriceCard from "./PriceCard";

const Pricing = () => {
    const [yearly, setYearly] = useState(false)

    let plans = [
        {
            name: 'מַתנֵעַ',
            price_per_month: 19,
            feature_1: true,
            feature_2: true,
            feature_3: true,
            feature_4: false,
            feature_5: false,
        },
        {
            name: 'תֶקֶן',
            price_per_month: 49,
            feature_1: true,
            feature_2: true,
            feature_3: true,
            feature_4: true,
            feature_5: false,
        },
        {
            name: 'פּרֶמיָה',
            price_per_month: 99,
            feature_1: true,
            feature_2: true,
            feature_3: true,
            feature_4: true,
            feature_5: true,
        }

    ]

    return (
        <div className="flex flex-col gap-3 bg-[#F8F9FF] py-20">
            <h2 className="text-center text-[60px] font-bold">תמחור ותוכניות</h2>
            <p className="text-center text-[16px] ">בחר את התוכנית המתאימה ביותר לצרכים המשפטיים שלך.</p>

            <div className="flex flex-row-reverse justify-center items-center gap-3  py-10 text-[19px]">
                <p>יַרחוֹן</p>
                <div onClick={() => setYearly(!yearly)} className={`w-14 cursor-pointer h-6 rounded-full flex items-center px-1  ${(yearly) ? 'justify-start bg-[#473BF0]' : 'justify-end bg-black bg-opacity-15'}`}>
                    <div className="bg-white w-4 h-4 rounded-full"></div>
                </div>
                <p>שְׁנָתִי</p>
                <p className="bg-black bg-opacity-15 rounded-full px-2 text-[13px] text-[#473BF0] font-semibold ">חסוך 25%</p>

            </div>

            <div className="flex flex-wrap flex-row-reverse justify-center pb-10 gap-10">
                {plans.map((plan, index) => <PriceCard key={index} planPrice={plan} yearPlan={yearly} />)}
            </div>
        </div>
    )
}

export default Pricing;