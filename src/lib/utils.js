import axios from "axios";
import { l } from "@/lib/language";
import { getEncoding } from "js-tiktoken";

export function generateUniqueId() {
  const randomness = Math.random().toString(36).substr(2, 9);
  const dateString = Date.now().toString(16);
  const uniqueId = dateString + randomness;
  return uniqueId;
}

export const arrTakeRight = (arr, n = 1) => (n <= 0 ? [] : arr.slice(-n));

// Gets text content of a txt file from its url
export async function getContentFromFileUrl(fileUrl) {
  const file = await axios.get(fileUrl);
  return file.data;
}

export function countTokens(text) {
  const enc = getEncoding("cl100k_base");
  const tokens = enc.encode(text);
  const tokenCount = tokens.length;
  // enc.free();
  return tokenCount;
}
