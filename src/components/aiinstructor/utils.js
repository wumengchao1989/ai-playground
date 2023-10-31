import { BlobServiceClient } from "@azure/storage-blob";

const blobSasUrl =
  "https://accpmigrationtest.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-10-31T14:06:26Z&st=2023-10-31T06:06:26Z&spr=https&sig=CGRT9RgrtWLh2OKsq2PhD%2BC%2FQYj2bjRjJPeG4zPaRbg%3D";
const blobServiceClient = new BlobServiceClient(blobSasUrl);
console.log("create client");
// Create a unique name for the container by
// appending the current time to the file name
const containerName = "voice";
// Get a container client from the BlobServiceClient
const containerClient = blobServiceClient.getContainerClient(containerName);
export default containerClient;
