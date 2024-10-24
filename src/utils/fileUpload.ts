import cryptoRandomString from 'crypto-random-string';
import sanitizeFilename from 'sanitize-filename';
import { savePhotoMetadata } from './db';

export interface UploadedFile {
  filepath: string;
  originalFilename: string;
  title: string;
  description: string;
}

export async function handleFileUpload(
  file: File,
  userId: string,
  title: string,
  description: string
): Promise<UploadedFile> {
  // Sanitize the original filename
  const sanitizedOriginalName = sanitizeFilename(file.name);
  
  // Generate unique filename
  const timestamp = Date.now();
  const randomString = cryptoRandomString({ length: 8, type: 'alphanumeric' });
  const newFilename = `${userId}_${timestamp}_${randomString}_${sanitizedOriginalName}`;
  
  // In a real application, you would upload the file to a storage service here
  // For this example, we'll use URL.createObjectURL
  const filepath = URL.createObjectURL(file);

  // Save metadata to database
  await savePhotoMetadata({
    filepath,
    userId,
    timestamp,
    description,
    title,
    originalFilename: sanitizedOriginalName
  });

  return {
    filepath,
    originalFilename: sanitizedOriginalName,
    title,
    description
  };
}