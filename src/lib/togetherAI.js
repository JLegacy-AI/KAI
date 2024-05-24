import axios from "axios";
import { countTokens } from "./utils";
import { findSimilarDocuments } from "./langchain";
import { TOGETHER_AI_API_KEY } from "./constants";

export async function chatCompletion(messages, model = "Open-Orca/Mistral-7B-OpenOrca") {
  try {
    const url = "https://api.together.xyz/v1/chat/completions";
    const response = await axios.post(
      url,
      {
        messages,
        model,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_AI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      console.error(error.response.data);
      return { error: error.response.data.message };
    }

    return { error: error.message };
  }
}

export async function askTogetherAI({
  question,
  chatHistory,
  botId,
  botPrompt = undefined,
  maxTokens = 0,
  model = "Open-Orca/Mistral-7B-OpenOrca",
}) {
  try {
    const chatHistoryTokens = countTokens(
      chatHistory.map((msg) => msg?.content).join("") + ` ${question}`
    );

    if (chatHistoryTokens > maxTokens)
      return { error: "Max Tokens Limit Reached", code: "FORBIDDEN" };

    const relevantDocs = await findSimilarDocuments({
      query: question,
      noOfDocs: 3,
      namespace: "user",
      filter: {
        botId: botId,
      },
    });

    if (relevantDocs.error) return relevantDocs;

    const contextText = relevantDocs.map((doc) => doc.pageContent).join("");
    const contextTextTokens = countTokens(contextText);

    if (chatHistoryTokens + contextTextTokens > maxTokens) {
      return { error: "Max Tokens Limit Reached", code: "FORBIDDEN" };
    }

    const chat = [
      {
        role: "system",
        content:
          `You are a helpful assistant. You are to base your responses on the chat history and provided context, in order to provide the best possible response to the user's latest question.
          ${botPrompt ? `Additionally, ${botPrompt}` : ""},
          Context: ${contextText}`,
      },
      ...(chatHistory?.map((m) => ({
        role: m.role == "user" ? "user" : "assistant",
        content: m.content,
      })) || []),
      { role: "user", content: question },
    ];

    const response = await chatCompletion(chat, model);

    if (response.error) return { error: response.error };
    return {
        answer: response.choices[0].message.content,
        usage: {
          inputTokens: response.usage.prompt_tokens,
          outputTokens: response.usage.completion_tokens,
        },
        tokensUsed: response.usage.total_tokens,

    }

  } catch (err) {
    console.log("[error@askTogetherAI]: ", err.message);
    return { error: err.message };
  }
}
