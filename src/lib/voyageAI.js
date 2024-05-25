// VoyageAI is only responsible for creating embeddings and storing them in pinecone

import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { pcIndex } from "./pinecone";
import { VOYAGE_API_KEY } from "./constants";

/**
 * Returns embeddings for every text
 * @param {String[]} texts
 * @returns []
 */
async function embedTexts(texts) {
  try {
    const url = "https://api.voyageai.com/v1/embeddings";
    const model = "voyage-2";
    const result = await axios.post(
      url,
      {
        model,
        input: texts,
      },
      {
        headers: {
          Authorization: `Bearer ${VOYAGE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return result.data.data;
  } catch (err) {
    console.log("[error@embedTexts:voyageAI]: ", err.message);

    if (err instanceof axios.AxiosError) {
      console.error(err.response.data);
      return { error: err.response.data.message };
    }

    return { error: err.message };
  }
}

export async function embedAndUpsertTexts({
  texts,
  metadata,
  pcOptions,
}) {
  try {

    // divide the texts into batches of 128
    const batchSize = 128;
    const batches = [];
    for (let i = 0; i < texts.length; i += batchSize) {
      batches.push(texts.slice(i, i + batchSize));
    }

    for (let i = 0; i < batches.length; i += 1) {
        const embeddings = await embedTexts(batches[i]);
        const upserts = embeddings.map((embedding, index) => ({
            id: uuidv4(),
            values: embedding.embedding,
            metadata: {
            ...metadata,
            text: texts[index],
            },
        }));
    
        await pcIndex.upsert(upserts, {
            // namespace: "user",
            ...(pcOptions ?? {}),
        });
    }

    return { message: "Embeddings stored successfully" };
  } catch (err) {
    // TODO cleanup pinecone incase the embeddings are not stored

    console.log("[error@embedAndUpsertTexts:voyageAI]: ", err.message);
    return { error: err.message };
  }
}
