import { storage } from '../config/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import express, { Request, Response, Router } from 'express';
import Item, { IItem } from '../models/ItemModel';
import User from '../models/UserModel';

const router: Router = Router();
// ItemRoutes.ts
console.log('Firebase Storage Bucket:', storage.app.options.storageBucket); // or console.log('Firebase Storage Bucket:', ref(storage, '/').toString());

interface ItemObj {
  category: string;
  place: string;
  description: string;
  ownerId: string;
}

router.get('/', async (req: Request, res: Response) => {
  const length: number = Number(req.query.number);
  try {
    const items: IItem[] = await Item.find().skip(length).limit(10);
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



router.post('/insertItem', async (req: Request, res: Response) => {
  const images = req.files as Express.Multer.File[];
  const { place, category, description, ownerId } = req.body;
 try {

   const imageUrls: string[] = [];
   for (const image of images) {
     if (!image.buffer || !(image.buffer instanceof Buffer)) {
       return res.status(400).json({ error: 'Invalid image data.' });
     }

     const imageRef = ref(storage, `images/${image.filename}`);
     await uploadBytes(imageRef, image.buffer);
     const downloadUrl = await getDownloadURL(imageRef);
     imageUrls.push(downloadUrl);
   }

   // Generate current date and time
   const currentDate = new Date();

   // Create a new item in the database
   const newItem: IItem = await Item.create({
     place,
     category,
     description,
     ownerId,
     images: imageUrls.map(url => ({ url })), // Save the download URLs of uploaded images to the database
     date: currentDate, // Save the current date and time to the database
   });

   console.log('New item created:', newItem);

   res.status(200).json(newItem);
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: 'Server error' });
 }
});


export default router;
