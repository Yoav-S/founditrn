import { storage } from '../config/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import express, { Request, Response, Router } from 'express';
import Item, { IItem } from '../models/ItemModel';
import User from '../models/UserModel';
import fs from 'fs';
import mongoose from 'mongoose';

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
    // Validate ownerId as a valid ObjectId


    let imageUrls: string[] = [];
    for (const image of images) {
      const imagePath = image.path;
      const imageBuffer = fs.readFileSync(imagePath);

      const imageRef = ref(storage, `images/${image.filename}`);
      await uploadBytes(imageRef, imageBuffer);
      const downloadUrl = await getDownloadURL(imageRef);
      imageUrls = [...imageUrls, downloadUrl];
    }
    
    const newItem: IItem = await Item.create({
      place,
      category,
      description,
      ownerId,
      images: imageUrls.map((url) => ({ url })), // Save the download URLs of uploaded images to the database
      date: new Date(), // Save the current date and time to the database
    });

    // Populate the ownerId field with the corresponding User object
    const populatedNewItem = await Item.findById(newItem._id).populate('ownerId');

    console.log('New item created:', populatedNewItem);

    res.status(200).json(populatedNewItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
