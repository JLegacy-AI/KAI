'use client'
import { ChevronLeft,ChevronUp } from 'lucide-react';
import { useState } from 'react';




const Question = ({ quest }) => {

    const [answer, setAnswer] = useState(false)
    return (
        <div className='border rounded-lg p-2'>
            <div dir='rtl'  className="w-full flex flex-row gap-2  justify-between">
                <p className='font-semibold text-start text-wrap w-[98%]'>{quest.q}</p>
                {(answer)? <ChevronUp className='cursor-pointer' onClick={()=>setAnswer(!answer)}/> : <ChevronLeft className='cursor-pointer' onClick={()=>setAnswer(!answer)} />}
            </div>
            {answer && <div className='my-4'>
                <p className='text-end max-w-96'>{quest.a}</p>
            </div>}
        </div>
    )
}

export default Question;