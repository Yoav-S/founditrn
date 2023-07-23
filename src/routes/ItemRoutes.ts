import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import express, { Request, Response, Router } from 'express';
import Item, { IItem } from '../models/ItemModel';
import User from '../models/UserModel';
import firebaseApp from '../config/firebase.config';

const storage = getStorage(firebaseApp);
const router: Router = Router();

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

// Set up multer middleware to handle multipart/form-data

// Route to create a new item
router.post('/insertItem', async (req: Request, res: Response) => {
  try {
    const { place, category, description, ownerId } = req.body;
    const images = req.files as Express.Multer.File[];
    console.log('place', place);
    console.log('category', category);
    console.log('description', description);
    console.log('ownerId', ownerId);
    console.log('images', images);

    // Upload images to Firebase Storage and get download URLs
    const imageUrls: string[] = [];
    for (const image of images) {
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
