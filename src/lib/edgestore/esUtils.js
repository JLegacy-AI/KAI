import { esBackendClient } from './edgestoreServer';

export async function getAllFilesFromEs(fileBucketName, options) {
  const allFiles = [];
  let currentPage = 1;

  // Remove pagination from options
  if (options?.pagination) {
    delete options.pagination;
  }

  // Fetch all files page by page
  while (true) {
    const res = await esBackendClient[fileBucketName].listFiles({
      pagination: {
        currentPage,
        pageSize: 100,
      },
      ...(options ?? {}),
    });
    allFiles.push(...res.data);
    if (currentPage >= res.pagination.totalPages) break;
    currentPage++;
  }

  // Return all files
  return allFiles;
}

// maxFiles is the maximum number of files to fetch, default is 5, max is 100
export async function getEntityFiles(entityId, maxFiles = 5) {
  const files = await esBackendClient.adminEntityFiles.listFiles({
    filter: {
      pagination: {
        currentPage: 1,
        pageSize: maxFiles,
      },
      path: {
        entityId,
      },
    },
  });
  // returns { data, pagination }
  return files;
}
