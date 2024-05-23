import { l } from "@/lib/language";


export function createDisplayMessage(queryType, query) {
  let displayMessage = "";

  switch (queryType) {
    case "question":
      displayMessage = query.content;
      break;
    case "rewrite":
      // displayMessage = `${l("Rewrite")} ${query.file.name}`;
      displayMessage = `${l("Rewrite")} ${query.file.name} ${l("for")} ${
        query.entity.name
      } ${l("as")} ${query.entity.type} ${l("with personality")} ${
        query.entity.personality
      }`;
      break;
    case "summarize":
      displayMessage = `${l("Summarize")} ${query.file.name}`;
      break;
    case "explain":
      displayMessage = `${l("Explain")} ${query.file.name}`;
      break;
    case "compare":
      displayMessage = `${l("Comparison of files")}: ${query.files
        .map((f) => f.name)
        .join(", ")}`;
      break;
  }

  return displayMessage;
}

export function getUsedTokensPercentage(tokensGranted, tokensUsed) {
  let percentage = 0;
  if (tokensUsed <= 0) return percentage;
  percentage = Math.min(Math.round((tokensUsed / tokensGranted) * 100), 100);
  return percentage;
}
