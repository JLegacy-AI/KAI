import Question from "./Question";



const FAQ=()=>{

    let questions=[
        {
            q:'באילו מסמכים משפטיים The-Lawyer.ai יכול לטפל?',
            a:'The-Lawyer.ai יכול לעבד מגוון מסמכים משפטיים, כולל חוזים, הסכמים, פסקי דין של בית משפט ומסמכים סטטוטוריים.'
        },
        {
            q:'האם הנתונים שלי בטוחים עם The-Lawyer.ai?',
            a:'The-Lawyer.ai יכול לעבד מגוון מסמכים משפטיים, כולל חוזים, הסכמים, פסקי דין של בית משפט ומסמכים סטטוטוריים.'
        },
        {
            q:'כיצד פועלת תכונת השוואת המסמכים?',
            a:'The-Lawyer.ai יכול לעבד מגוון מסמכים משפטיים, כולל חוזים, הסכמים, פסקי דין של בית משפט ומסמכים סטטוטוריים.'
        },
        {
            q:'האם אוכל לבטל את המנוי שלי בכל עת?',
            a:'The-Lawyer.ai יכול לעבד מגוון מסמכים משפטיים, כולל חוזים, הסכמים, פסקי דין של בית משפט ומסמכים סטטוטוריים.'
        }
    ]

    return(
        <div className="flex flex-col items-center gap-3 my-14 text-white">
            <h3 className="text-[36px] text-center font-semibold">שאלות נפוצות</h3>
            <p className="text-[19px] text-center max-w-96">קבל תשובות מהירות לשאלותיך</p>
           
           <div className="flex flex-col justify-center px-2 my-10 gap-3">
            {questions.map((item, index)=><Question key={index} quest={item}/>)}
           </div>
 <p className="px-4 text-center flex flex-col sm:block">קיבלת את התשובה שלך?<a className="text-[#473BF0]" href="">צור קשר עם התמיכה שלנו עכשיו</a></p>
       </div>
    )
}


export default FAQ;