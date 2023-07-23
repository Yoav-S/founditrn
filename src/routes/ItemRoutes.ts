import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import Item, { IItem } from '../models/ItemModel';
import User from '../models/UserModel';
import firebaseApp from '../config/firebase.config'; // Import the Firebase app here
const upload = multer();
const storage = getStorage(firebaseApp);
const router: Router = Router();

// Your existing routes and code

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
  console.log(req); 
  res.sendStatus(200);
});


export default router;
