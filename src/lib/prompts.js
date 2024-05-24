import { l } from "@/lib/language";

// Hebrew Version
/*
export const prompts = {
  question: (contextText) => {
    return `אתה עוזר משפטי מועיל, אתה מקבל הקשר, היסטוריית צ'אט והשאלה האחרונה של המשתמש. עליך לחלץ מידע מההקשר ומהיסטוריית הצ'אט כדי לספק תשובה לשאלת המשתמש. אם אינך יכול לספק תשובה, תוכל לשאול שאלות הבהרה. \n\n הֶקשֵׁר: \n ${contextText}`;
  },
  summarize: (text) => {
    return `נא לספק סיכום תמציתי ומדויק של התיק המשפטי. ודא שהתקציר כולל את נקודות המפתח, הטיעונים העיקריים ופרטים חיוניים מהמסמך המקורי. במידת האפשר, נא להדגיש את הנקודות הקריטיות ביותר ולארגן מחדש את המידע באופן הגיוני וקוהרנטי. \n\n טֶקסט: \n ${text}`;
  },
  explain: (text) => {
    return `אנא ספק הסבר תמציתי וברור של הטקסט הבא, תוך פירוק מושגים מורכבים לשפה פשוטה יותר והדגשת כל נקודות מפתח או דרישות. שאפו להפוך את הקובץ לקל יותר להבנה עבור קהל שאינו מומחים. \n\n טֶקסט: \n ${text}`;
  },
  compareFiles: (files) => {
    return `בדוק מספר תיקים משפטיים וספק השוואה מפורטת של תוכנם, תוך הדגשת ההבדלים והדמיון ביניהם. עבור כל הבדל, זהה את טיבו (למשל, שינוי, הוספה, מחיקה) והעריך את החוזקות והחולשות של כל גרסה, תוך מתן דוגמאות ספציפיות לתמיכה בניתוח שלך. קבצים: \n ${files
      .map((file) => `${file.name} \n\n ${file.content}`)
      .join("\n\n")}`;
  },
  writeEntityProfile: (files) => {
    return `צור פרופיל המסכם ומנתח את נטיות קבלת ההחלטות של שופט/עורך דין/פרופסור ספציפי, על סמך אוסף תיקים הקשורים לפסקי דין והחלטות קודמים שלו. הפרופיל צריך לזהות דפוסים, הטיות והעדפות בקבלת ההחלטות של השופט, כולל כל החוזק, החולשה והעקביות הבולטים. ספק סקירה תמציתית של נטיות השופט, תוך הדגשת תובנות מפתח והמלצות לשיפור קבלת ההחלטות \n\n קבצים: \n ${files
      .map((file) => `${file.name}: \n ${file.content}`)
      .join("\n")}`;
  },
  rewriteUsingEntityProfile: (fileContent, entityProfile) => {
    return `שכתוב קובץ נתון כדי לשקף טוב יותר את נטיות קבלת ההחלטות של שופט/עורך דין/פרופסור ספציפי, כפי שסוכמו ונותחו בפרופיל שלהם. השתמש בתובנות ובדפוסים שזוהו בפרופיל השופט כדי להחדיר לקובץ המשוכתב שפה וניסוח התואמים את הגישות האופייניות, ההטיות וההרגלי קבלת ההחלטות שלהם, אך אל תזכיר את הפרופיל שלהם בתשובתך. \n\n
    פרופיל השופט \n ${entityProfile} \n\n
    קובץ לשכתוב: ${fileContent}`;
  },
};
*/


// English Version
export const prompts = {
  question: (contextText) => {
    return `${l(
      "You are a specialised assitant, You are given context to specialise in, a chat history and the user's latest question. You are to extract information from the context and chat history to provide an answer to the user's question. If you are unable to provide an answer, you can ask clarifying questions. {your answer}"
    )}. \n\n ${l("Context")}: \n ${contextText}`;
  },
  summarize: (text) => {
    return `${l(
      "Please provide a concise and accurate summary of the legal file. Ensure the summary includes the key points, main arguments, and essential details from the original document. If possible, please highlight the most critical points and reorganize the information in a logical and coherent manner."
    )} \n\n ${l("Text")}: \n ${text}`;
  },
  explain: (text) => {
    return `${l(
      "Please provide a concise and clear explanation of the following text, breaking down complex concepts into simpler language and highlighting any key points or requirements. Aim to make the file easier to comprehend for a non-expert audience."
    )} \n\n ${l("Text")}: \n ${text}`;
  },
  compareFiles: (files) => {
    return `${l(
      "Analyze provided multiple legal files and provide a detailed comparison of their contents, highlighting both the differences and similarities between them. For each difference, identify its nature (e.g., modification, addition, deletion) and assess the strengths and weaknesses of each version, providing specific examples to support your analysis."
    )} ${l("Files")}: \n ${files
      .map((file) => `${file.name} \n\n ${file.content}`)
      .join("\n\n")}`;
  },
  writeEntityProfile: (files) => {
    return `${l(
      "Create a profile that summarizes and analyzes the decision-making tendencies of a specific judge/lawyer/professor, based on a collection of files related to their previous judgments and decisions. The profile should identify patterns, biases, and preferences in the judge's decision-making, including any notable strengths, weaknesses, and consistencies. Provide a concise overview of the judge's tendencies, highlighting key insights and recommendations for improved decision-making"
    )} \n\n ${l("Files")}: \n ${files
      .map((file) => `${file.name}: \n ${file.content}`)
      .join("\n")}`;
  },
  rewriteUsingEntityProfile: (fileContent, entityProfile) => {
    return `${l(
      "Rewrite a given file to better reflect the decision-making tendencies of a specific judge/lawyer/professor, as summarized and analyzed in their profile. Use the insights and patterns identified in the judge's profile to infuse the rewritten file with language and phrasing that is consistent with their typical approaches, biases, and decision-making habits but do not mention their profile in your answer."
    )} \n\n
      ${l("Judge Profile:")} \n ${entityProfile} \n\n
      ${l("File to Rewrite")}: ${fileContent}`;
  },
};
