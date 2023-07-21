import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import config from '../config/firebase.config';
import Item, { IItem } from '../models/ItemModel';
import User from '../models/UserModel';
const upload = multer();
initializeApp(config.firebaseConfig);
const storage = getStorage();
const router: Router = express.Router();


interface ItemObj {
  category: string;
  place: string;
  description: string;
  ownerId: string;
  imagePaths: string[]; // Array to store the Firebase Storage paths of the uploaded images
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
router.post('/insertItem', upload.array('images'), async (req: Request, res: Response) => {
  const imageAssets = req.body.images;
  const { place, category, description, ownerId } = req.body;

  // Create an array to store the Firebase Storage paths of the uploaded images
  const imagePaths: string[] = [];

  try {
    // Upload each image to Firebase Storage
    for (const image of imageAssets) {
      const imageRef = ref(storage, `images/${image.fileName}`);
      await uploadBytes(imageRef, Buffer.from(image.data, 'base64'));

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(imageRef);
      imagePaths.push(downloadURL);
    }

    // Create the item object including the image paths
    const itemObj: ItemObj = {
      category,
      place,
      description,
      ownerId,
      imagePaths,
    };

    const newItem = new Item(itemObj);
    const savedItem = await newItem.save();

    // Log the received data and the saved item
    console.log('Place:', place);
    console.log('Category:', category);
    console.log('Description:', description);
    console.log('Owner ID:', ownerId);
    console.log('Image Paths:', imagePaths);
    console.log('Saved Item:', savedItem);

    res.sendStatus(200); // Send an OK response
  } catch (error) {
    console.error('Error handling the request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
