
import Image from 'next/image';
import image from '../../../public/assets/hero.png'

const About = () => {
    return (
        <div className="flex flex-col items-center gap-3 my-14 text-white">
            <h3 className="text-[36px] text-center font-semibold">למה כדאי לבחור בנו?</h3>
            <p className="text-[19px] text-center max-w-96 px-3">עם הרבה בלוקים ייחודיים, אתה יכול בקלות לבנות דף ללא קידוד. בנה את דף הנחיתה הבא שלך.</p>
            <div className="flex gap-10 md:gap-20 my-8 flex-col md:flex-row-reverse justify-center items-center w-full px-4 md:px-10">
                <div className=" w-full md:w-[40%]">
                    <Image src={image} alt='' />
                </div>

                <div className="w-full md:w-[40%] flex flex-col gap-4">

                    <div className='flex flex-row-reverse gap-2'> 
                        <div className='w-8 h-8 rounded-full  flex justify-center items-center bg-[#679edd]'>1</div>
                        <div className='flex flex-col gap-3'>
                            <h3 className='text-[21px] text-end font-semibold'>טכנולוגיית AI מתקדמת</h3>
                            <p className='text-end text-[17px] max-w-80 '>שימוש בבינה מלאכותית מתקדמת המיועדת ליישומים משפטיים.</p>
                        </div>
                    </div>

                    <div className='flex flex-row-reverse gap-2'> 
                        <div className='w-8 h-8 rounded-full  flex justify-center items-center bg-[#679edd]'>2</div>
                        <div className='flex flex-col gap-3'>
                            <h3 className='text-[21px] text-end font-semibold'>פתרונות מקיפים</h3>
                            <p className='text-end text-[17px] max-w-80 '>משאלות ותשובות פשוטות ועד לניהול מסמכים מורכב לכל גודל של עיסוק משפטי.</p>
                        </div>
                    </div>
                    <div className='flex flex-row-reverse gap-2'> 
                        <div className='w-8 h-8 rounded-full  flex justify-center items-center bg-[#679edd]'>3</div>
                        <div className='flex flex-col gap-3'>
                            <h3 className='text-[21px] text-end font-semibold'>עיצוב ממוקד משתמש</h3>
                            <p className='text-end text-[17px] max-w-80 '>UI/UX האינטואיטיבי שלנו קל לניווט, מה שמבטיח שתוכל להתמקד יותר בעבודה משפטית.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;