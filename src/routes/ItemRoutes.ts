import { initializeApp } from 'firebase/app';
import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
router.post('/insertItem', upload.array('file'), async (req: Request, res: Response) => {
  const itemObj = JSON.parse(req.body.itemObj) as ItemObj; // Parse the itemObj from the JSON string
  const files = req.files as Express.Multer.File[];

  console.log(itemObj);
  console.log(files);

  // Your code to save the images to Firebase Storage and store the image paths in the database

  res.sendStatus(200); // Send an OK response
  
  // Images will be available in req.files as Express.Multer.File[]
// const images = req.files as Express.Multer.File[];
//
// // Check if 'images' is defined and an array
//
//
// // Get the rest of the post properties from the query string
// const { place, category, description, ownerId, date } = req.query;
//
// try {
//   // Process the images array here
//
//   const categoryValue: string = category as string;
//   const dateValue: Date = new Date(date as string);
//   const placeValue: string = place as string;
//   const descriptionValue: string = description as string;
//   const ownerIdValue: string = ownerId as string;
//
//   const newItem = new Item({
//     category: categoryValue,
//     date: dateValue,
//     place: placeValue,
//     description: descriptionValue,
//     ownerId: ownerIdValue,
//   });
//
//   // Save the new item to the database
//   const savedItem = await newItem.save();
//
//   // Populate the ownerId with the User document
//   await User.findByIdAndUpdate(ownerIdValue, { $push: { items: savedItem._id } }, { new: true });
//
//   res.status(200).json({ message: 'Post Uploaded Successfully !' });
// } catch (err) {
//   console.error(err);
//   res.status(500).json({ error: 'Server error' });
// }
});


export default router;
