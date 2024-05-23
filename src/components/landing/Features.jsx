
import Image from 'next/image';
import svg1 from '../../../public/assets/f1.svg'
import svg2 from '../../../public/assets/f2.svg'
import svg3 from '../../../public/assets/f3.svg'
import { ArrowLeft } from 'lucide-react';

const Features = () => {
    return (
        <>
            <div className="flex flex-col gap-3 bg-[#F8F9FF] py-20">
                <h2 className="text-center text-[60px] font-bold">מאפיינים</h2>
                <p className="text-center text-[16px] ">אלו הן רק כמה תכונות שתקבלו באמצעות הכל עורך דין AI</p>
                <div className="flex flex-wrap gap-10 justify-center items-center my-10 px-8">

                    <div className="w-80 bg-white rounded-md flex flex-col items-center gap-5 py-8">
                        <section className='p-4 bg-[#f3cf7333] rounded-md'>
                            <Image src={svg3} alt='' sizes={56} />
                        </section>
                        <h2 className="text-[28px] text-center font-semibold">חיפוש מידע משפטי</h2>
                        <p className="text-center px-6">צור קשר עם הצ'אטבוט המופעל על ידי AI שלנו כדי לחפש מידע משפטי, לסכם מסמכים ולקבל תשובות מדויקות לשאלות המשפטיות שלך.</p>
                        <button type="button" className='flex gap-3 font-semibold text-[#009379]'><ArrowLeft />למד עוד</button>
                    </div>


                    <div className="w-80 bg-white rounded-md flex flex-col items-center gap-5 py-8 px-8">
                        <section className='p-4 bg-[#00937933] rounded-md'>
                            <Image src={svg2} alt='' sizes={56} />
                        </section>
                        <h2 className="text-[28px] text-center font-semibold">השווה מסמכים משפטיים</h2>
                        <p className="text-center px-6">העלה מסמכים מרובים ותנו ל-AI שלנו לנתח ולהשוות, ולספק לכם תובנות לגבי חוזקות וחולשות.</p>
                        <button type="button" className='flex gap-3 font-semibold text-[#009379]'><ArrowLeft />למד עוד</button>
                    </div>

                    <div className="w-80 bg-white rounded-md flex flex-col items-center gap-5 py-8">
                        <section className='p-4 bg-[#FF625033] rounded-md'>
                            <Image src={svg1} alt='' sizes={56} />
                        </section>
                        <h2 className="text-[28px] text-center font-semibold">שכתוב מסמכים משפטיים</h2>
                        <p className="text-center px-6">שפר את המסמכים המשפטיים שלך עם הצעות הבינה המלאכותית שלנו לשכתובים העומדים בסטנדרטים המשפטיים הטובים ביותר.</p>
                        <button type="button" className='flex gap-3 font-semibold text-[#009379]'><ArrowLeft />למד עוד</button>
                    </div>


                </div>
            </div>
        </>
    )
}

export default Features;