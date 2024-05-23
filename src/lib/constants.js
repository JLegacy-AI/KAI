// constants are environment variables

export const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const MONGODB_URI = process.env.MONGODB_URI;
export const USER_JWT_SECRET = process.env.USER_JWT_SECRET;
export const EDGE_STORE_ACCESS_KEY = process.env.EDGE_STORE_ACCESS_KEY;
export const EDGE_STORE_SECRET_KEY = process.env.EDGE_STORE_SECRET_KEY;
export const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
export const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;
export const PINECONE_INDEX_DIMENSION = process.env.PINECONE_INDEX_DIMENSION // This is the dimension of the embeddings
  ? parseInt(process.env.PINECONE_INDEX_DIMENSION)
  : 1536;
export const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY; // Embeddings Model API KEY
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY; // Claude LLM API Key
