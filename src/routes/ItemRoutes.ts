import { initializeApp } from 'firebase/app';
import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import config from '../config/firebase.config';
import Item, { IItem } from '../models/ItemModel';
import User from '../models/UserModel';

initializeApp(config.firebaseConfig);
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });
const router: Router = express.Router();

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
  const { category, date, place, description, ownerId } = req.body;
  const images: Express.Multer.File[] = req.files as Express.Multer.File[];

  // Upload images to Firebase Storage
  const imageUrls: string[] = await Promise.all(
    images.map(async (image) => {
      const imageRef = ref(storage, `images/${image.originalname}`);
      await uploadBytes(imageRef, image.buffer);
      return getDownloadURL(imageRef);
    })
  );

  try {
    const categoryValue: string = category;
    const dateValue: Date = new Date(date);
    const placeValue: string = place;
    const descriptionValue: string = description;
    const ownerIdValue: string = ownerId;

    const newItem = new Item({
      category: categoryValue,
      date: dateValue,
      place: placeValue,
      description: descriptionValue,
      ownerId: ownerIdValue,
      images: imageUrls,
    });

    // Save the new item to the database
    newItem
      .save()
      .then((savedItem) => {
        // Populate the ownerId with the User document
        return User.findByIdAndUpdate(ownerId, { $push: { items: savedItem._id } }, { new: true });
      })
      .then(() => {
        res.status(200).json({ message: 'Post Uploaded Successfully!' });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
