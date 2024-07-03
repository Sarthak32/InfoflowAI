import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import * as fs from 'fs/promises';
import { mkdir  } from 'fs/promises';
import {firebaseConfig} from "./firebase"


const firebaseApp = initializeApp(firebaseConfig);

async function ensureDirectoryExists(directory: string) {
  try {
    await mkdir(directory, { recursive: true });
  } catch (error) {
    // Directory already exists, or an error occurred (which will be caught when trying to write the file)
    console.log("Directory already exists, or an error occurred")
  }
}

export async function downloadfilefromfirebase(file_key: string): Promise<string | null> {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, file_key);
    const downloadURL = await getDownloadURL(storageRef);

    const localFilePath = `/tmp/elliott${Date.now().toString()}.pdf`;

    await ensureDirectoryExists('/tmp/');

    const response = await fetch(downloadURL);
    const fileBuffer = await response.arrayBuffer();

    await fs.writeFile(localFilePath, Buffer.from(fileBuffer));

    console.log('File Key:', file_key);
    console.log('Download URL:', downloadURL);
    console.log('Local File Path:', localFilePath);
    return localFilePath;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getfileurl(file_key:string){
  try {
    const storage = getStorage();
    const storageRef = ref(storage, file_key);
    const downloadURL = await getDownloadURL(storageRef);
    console.log("downloadURL :" ,downloadURL);
    return downloadURL;
} catch (error) {
    console.error("Error retrieving download URL:", error);
    return null; // or throw error; depending on your error handling strategy
}
}
