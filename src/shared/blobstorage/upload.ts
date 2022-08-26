import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuid } from "uuid";
import { Options } from "./types";

const CONTAINER_NAME = process.env.CONTAINER_NAME || "gifcollage";
const BLOB_STORAGE_URL =
  process.env.BLOB_STORAGE_URL ||
  "https://storagegifcollageprod.blob.core.windows.net";

export async function uploadFile(
  sasToken: string,
  file: File,
  options: Options = {}
) {
  const {
    metadata = {},
    onProgress = () => {},
    fileName,
    abortSignal,
  } = options;
  const blobService = new BlobServiceClient(`${BLOB_STORAGE_URL}?${sasToken}`);
  const containerClient = blobService.getContainerClient(CONTAINER_NAME);
  const blobDir = options.blobDirectory || "files"; // optionally override blob directory file is uploaded to.
  const blobClient = containerClient.getBlockBlobClient(
    `${blobDir}/${uuid()}_${fileName ? fileName : file.name}`
  );
  // upload file
  return blobClient.uploadData(file, {
    blobHTTPHeaders: { blobContentType: file.type },
    metadata,
    onProgress,
    abortSignal,
  });
}
