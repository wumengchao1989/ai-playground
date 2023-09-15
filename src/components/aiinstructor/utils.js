import { BlobServiceClient } from "@azure/storage-blob";

const blobSasUrl =
  "https://voicerecord.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2026-11-07T12:31:03Z&st=2023-09-12T04:31:03Z&spr=https&sig=Uu0IEgT0qjORPIVXaQuYC2JOErK9s%2FB3ADGWRjosny4%3D";
const blobServiceClient = new BlobServiceClient(blobSasUrl);
console.log("create client");
// Create a unique name for the container by
// appending the current time to the file name
const containerName = "voice";
// Get a container client from the BlobServiceClient
const containerClient = blobServiceClient.getContainerClient(containerName);
export default containerClient;
