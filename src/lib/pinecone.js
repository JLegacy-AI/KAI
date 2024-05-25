import { Pinecone } from "@pinecone-database/pinecone";
import { PINECONE_API_KEY, PINECONE_INDEX_NAME } from "./constants";

const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

export const pcIndex = pinecone.Index(PINECONE_INDEX_NAME);
