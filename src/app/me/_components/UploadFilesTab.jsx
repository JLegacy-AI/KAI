"use client";

import { MultiFileDropzone } from "./MultiFileDropzone";
import { useEdgeStore } from "@/lib/edgestore/edgestore";
import { useState, useEffect } from "react";
import { createTextFile } from "@/utils/fileUtils";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";

/**
 *
 * @param {fileBucketName} - The name of the file bucket to upload the files to.
 * @param {moreInput} - Additional input to be uploaded with the file, added as metadata to file.
 * @returns
 */
export default function UploadFilesTab({
  fileBucketName,
  tokensAvailable = 0,
  /* Optional */
  moreInput,
  dropzoneClassname,
}) {
  const [fileStates, setFileStates] = useState([]);
  const { edgestore } = useEdgeStore();

  /*
  useEffect(() => {
    console.log("File States: ", fileStates);
  }, [fileStates]);
  */

  function updateFileProgress(key, progress) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  return (
    <div className="h-full w-full flex-1">
      <MultiFileDropzone
        className={twMerge(
          "mt-2 bg-white w-full h-full flex-1",
          dropzoneClassname
        )}
        value={fileStates}
        onChange={(files) => {
          setFileStates(files);
        }}
        onFilesAdded={async (addedFiles) => {
          let shouldAbort = false;
          // Check if the user has enough tokens to upload the files, if no then abort the upload and set the progress to error
          addedFiles = addedFiles.map((addedFile) => {
            if (addedFile.tokens <= tokensAvailable) {
              addedFile.progress = 0;
              return addedFile;
            };

            addedFile.progress = "ERROR";
            shouldAbort = true;
            toast.error(
              `Insufficient tokens to upload file: ${addedFile.file.name}`
            );
          });

          setFileStates([...fileStates, ...addedFiles]);

          if (shouldAbort) return;

          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                console.log("Uploading File: ", addedFileState.file.name);
                updateFileProgress(addedFileState.key, 1);
                const res = await edgestore[fileBucketName].upload({
                  file: addedFileState.file,
                  input: {
                    id: addedFileState.key, // Id is important, because vector embeddings are stored with this id, since file of url is not available in the beforeUpload hook
                    fileText: addedFileState.text,
                    name: addedFileState.file.name,
                    ...(moreInput ?? {}), // Add additional input to the file, like userId, botId etc.
                  },
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar at 100%
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, "COMPLETE");
                    }
                  },
                });
                console.log("Response: ", res);
              } catch (err) {
                toast.error(`Error uploading file: ${addedFileState.file.name}`);
                updateFileProgress(addedFileState.key, "ERROR");
              }
            })
          );
        }}
        dropzoneOptions={{
          accept: {
            "text/plain": [".txt"],
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              [".docx"],
            "application/msword": [".doc"],
          },
        }}
      />
    </div>
  );
}
