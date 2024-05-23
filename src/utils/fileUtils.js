import { fileToText } from "file-to-text";

export function replaceExtension(fileName, newExtension) {
  return fileName.replace(/\.[^/.]+$/, newExtension);
}

export async function createTextFile(file) {
  if (!file) throw new Error("file is required");

  const fileText = await fileToText(file);
  // console.log("[createTextFile]: ", fileText);
  const newFilename = replaceExtension(file.name, ".txt");
  const fileType = { type: "text/plain" };
  const newBlob = new Blob([fileText], fileType);
  const newFile = new File([newBlob], newFilename, fileType);
  return {
    file: newFile,
    text: fileText,
  };
}
