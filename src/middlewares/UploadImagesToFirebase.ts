import { getStorage, ref, uploadBytes, getDownloadURL, UploadResult } from 'firebase/storage';
import { Express } from 'express';

const uploadImagesToFirebase = async (images: Express.Multer.File[]): Promise<string[]> => {
  const storage = getStorage();
  const imageUrls: string[] = [];

  try {
    for (const image of images) {
      const storageRef = ref(storage, `images/${image.originalname}`);
      const uploadTask: UploadResult = await uploadBytes(storageRef, image.buffer, { contentType: image.mimetype });
      const downloadURL: string = await getDownloadURL(uploadTask.ref);
      imageUrls.push(downloadURL);
    }

    return imageUrls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

export default uploadImagesToFirebase;
