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
  try {
    // Extract the startIndex from the query parameters, default to 0 if not provided
    const startIndex = parseInt(req.query.startIndex as string, 10) || 0;

    // Fetch the next 10 items from the database
    const items = await Item.find().skip(startIndex).limit(10);

    // Download the images from Firebase and add them to the item objects
    const itemsWithImages = await Promise.all(
      items.map(async (item) => {
        const imageUrls = await Promise.all(
          item.images.map(async (imageUrl) => {
            const imageRef = ref(storage, imageUrl);
            return getDownloadURL(imageRef);
          })
        );

        return { ...item.toObject(), images: imageUrls };
      })
    );

    res.status(200).json(itemsWithImages);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



router.post('/insertItem', async (req: Request, res: Response) => {
  const images = req.files as Express.Multer.File[];
  const { place, category, description, ownerId } = req.body;

  try {
    // Validate ownerId as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ error: 'Invalid ownerId' });
    }

    let imageUrls: string[] = [];
    for (const image of images) {
      const imagePath = image.path;
      const imageBuffer = fs.readFileSync(imagePath);

      const imageRef = ref(storage, `images/${image.filename}`);
      await uploadBytes(imageRef, imageBuffer);
      const downloadUrl = await getDownloadURL(imageRef);
      imageUrls = [...imageUrls, downloadUrl];
    }

    // Create a new item in the database
    const newItem: IItem = await Item.create({
      place,
      category,
      description,
      ownerId,
      images: imageUrls, // Save the image URLs directly as an array of strings
      date: new Date(), // Save the current date and time to the database
    });

    // Populate the ownerId field with the corresponding User object
    const populatedNewItem = await Item.findById(newItem._id).populate('ownerId');

    // Add the newItem's _id to the user's items array
    const user = await User.findById(ownerId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const newitemsArray = [...user.items, newItem.id];
    user.items = newitemsArray;
    await user.save();

    console.log('New item created:', populatedNewItem);

    res.status(200).json({ message: 'Post Upload Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
