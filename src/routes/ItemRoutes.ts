import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import express, { Request, Response, Router } from 'express';
import Item, { IItem } from '../models/ItemModel';
import User from '../models/UserModel';
import firebaseApp from '../config/firebase.config'; // Import the Firebase app here

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

// Route to create a new item
router.post('/insertItem', async (req: Request, res: Response) => {
  try {
    const { place, category, description, ownerId } = req.body; // Extract other fields from req.body
    const images = req.files as Express.Multer.File[]; // Extract the uploaded images as an array
    console.log('place', place);
    console.log('category', category);
    console.log('description', description);
    console.log('ownerId', ownerId);
    console.log('images', images);
    
    // Create a new item in the database
    const newItem: IItem = await Item.create({
      place,
      category,
      description,
      ownerId,
      images: images.map(image => ({ url: image.path })), // Save the paths of uploaded images to the database
    });
    console.log(newItem);
    
    res.status(200).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
