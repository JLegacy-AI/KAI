import {
  VOYAGE_API_KEY,
  PINECONE_API_KEY,
  PINECONE_INDEX_NAME,
  PINECONE_INDEX_DIMENSION,
} from "@/lib/constants";
import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatAnthropic } from "@langchain/anthropic";
import { TogetherAI } from "@langchain/community/llms/togetherai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { prompts } from "./prompts";
import { countTokens } from "./utils";
import { TRPCError } from "@trpc/server";

const embeddings = new VoyageEmbeddings({
  apiKey: VOYAGE_API_KEY,
  modelName: "voyage-2", // context Length is 4000 tokens
});
const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});
const pcIndex = pinecone.Index(PINECONE_INDEX_NAME);
const llm = new TogetherAI({
  temperature: 0.9,
  model: "Open-Orca/Mistral-7B-OpenOrca",
  // maxTokens: 1024,
});

/**
 *
 * @param {String} text
 * @returns vector embeddings of the text
 */
export async function embedQuery(text) {
  return await embeddings.embedQuery(text);
}

/**
 *
 * @param {String[]} textDocs
 * @returns vector embeddings of the documents
 */
/*
export async function embedDocument(textDocs) {
  return await embeddings.embedDocument(textDocs);
}
*/

/**
 *
 * @param {String} text
 * @param {Object} metadata - metadata for the text
 * @returns vector embeddings of the chunked text
 */
async function embedText(text, metadata = {}) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkOverlap: 200,
    chunkSize: 1000,
  });

  // Split the text into chunks, also add metadata to each chunk
  let textChunks = await splitter.createDocuments([text], [metadata]);

  const vectorEmbeddings = await embeddings.embedDocument(textChunks);
  return vectorEmbeddings;
}

/**
 *
 * @param {String} text
 * @param {Object} metadata - metadata for the text
 * @returns vector embeddings of the chunked text
 */
export async function embedAndStoreText(text, metadata = {}, options = {}) {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkOverlap: 200,
      chunkSize: 1000,
    });

    // Split the text into chunks, also add metadata to each chunk
    let textChunks = await splitter.createDocuments([text], [metadata]);
    console.log("Total Chunks: ", textChunks.length);

    const pineconeRes = await PineconeStore.fromDocuments(
      // only select the first 5 chunks
      textChunks,
      embeddings,
      {
        pineconeIndex: pcIndex,
        maxConcurrency: 5,
        ...options,
      }
    );

    // console.log("[embedAndStoreText] Pinecone Res:", pineconeRes);
    return { message: "Text embedded and stored successfully" };
  } catch (err) {
    console.log("[error@embedAndStoreText]: ", err.message);
    return { error: err.message };
  }
}

async function deleteEmbeddings(metadata, namespace) {
  try {
    const res = await pcIndex.namespace(namespace ?? "").query({
      vector: new Array(PINECONE_INDEX_DIMENSION).fill(0),
      filter: metadata,
      topK: 1000,
      includeValues: false,
      includeMetadata: true,
    });

    if (res?.matches?.length === 0) {
      console.log(
        "[deleteEmbeddings], No embeddings found to delete with metadata: ",
        metadata
      );
      return { message: "No embeddings found to delete" };
    }

    const vectorIds = res?.matches?.map((match) => match.id);
    await pcIndex.namespace(namespace ?? "").deleteMany(vectorIds);

    console.log(
      `[deleteEmbeddings]: deleted ${res?.matches?.length} embeddings, associated with metadata: `,
      metadata
    );

    return { message: "Embeddings deleted successfully" };
  } catch (err) {
    console.log("[error@deleteEmbeddings]: ", err.message);
    return { error: err.message };
  }
}

export async function deleteEmbeddingsByFileId(fileId, namespace) {
  try {
    // Starter and Serverless indexes do not support delete by metadata filtering, so we need to query the embeddings first
    const res = await deleteEmbeddings({ fileId }, namespace);
    return res;
  } catch (err) {
    console.log("[error@deleteEmbeddingsByFileId]: ", err.message);
    return { error: err.message };
  }
}

/**
 *
 * @param {String} query - Question to find relevant documents for
 * @param {String} namespace - Namespace to search in
 * @param {Object} filter - Metadata filter for the search
 * @param {Number} noOfDocs - Number of documents to return
 */
export async function findSimilarDocuments({
  query,
  namespace,
  filter,
  noOfDocs = 3,
}) {
  try {
    const vectorStoreOptions = {
      pineconeIndex: pcIndex,
    };

    if (namespace) vectorStoreOptions.namespace = namespace;

    const vectorStore = await PineconeStore.fromExistingIndex(
      embeddings,
      vectorStoreOptions
    );

    const res = await vectorStore.similaritySearch(
      query,
      noOfDocs,
      filter ?? {}
    );

    return res;
  } catch (err) {
    console.log("[error@findSimilarDocuments]: ", err.message);
    return { error: err.message };
  }
}

export function messagesToChat(messages) {
  if (!messages || !Array.isArray(messages)) {
    console.log("[messagesToChat], Invalid messages array");
    return [];
    // return { error: "Invalid messages array" };
  }

  const chatHistory = messages.map((msg, idx) => {
    if (!msg.message) return;
    return msg.role === "user"
      ? new HumanMessage(msg.message)
      : new AIMessage(msg.message);
  });

  return chatHistory;
}

function formatClaudeAiResponse(res) {
  console.log("[formatClaudeAiResponse], Res: ", res);
  return {
    answer: res.content,
    usage: {
      inputTokens: res.response_metadata.usage.input_tokens,
      outputTokens: res.response_metadata.usage.output_tokens,
    },
    tokensUsed:
      res.response_metadata.usage.input_tokens +
      res.response_metadata.usage.output_tokens, // total tokens used (input + output)
  };
}

function formatAiResponse(res) {}

// Provide userId if contextType is "local"
export async function askAi({
  question,
  chatHistory,
  contextType,
  userId,
  botId,
  log = false,
  maxTokens = 0,
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

    console.log("[askAI], Relevant Docs: ", relevantDocs);

    if (relevantDocs.error) return relevantDocs;

    const contextText = relevantDocs.map((doc) => doc.pageContent).join("");
    const contextTextTokens = countTokens(contextText);

    if (chatHistoryTokens + contextTextTokens > maxTokens) {
      return { error: "Max Tokens Limit Reached", code: "FORBIDDEN" };
    }

    const chat = [
      new SystemMessage(prompts.question(contextText)),
      ...(chatHistory ?? []),
      new HumanMessage(question),
    ];

    console.log("[askAI], Chat: ", question, chat);

    const res = await llm.invoke(chat);
    const resTokens = countTokens(res);
    if (log || true) console.log("[askAi], Res:", res);
    return {
      answer: res,
      usage: {
        inputTokens: chatHistoryTokens + contextTextTokens,
        outputTokens: resTokens,
      },
      tokensUsed: chatHistoryTokens + contextTextTokens + resTokens,
    };
  } catch (err) {
    console.log("[askAI], Error: ", err.message);
    return { error: err.message };
  }
}
