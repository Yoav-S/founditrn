import { initializeApp } from 'firebase/app';
import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import Item, { IItem } from '../models/ItemModel';
import User from '../models/UserModel';
const upload = multer();

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
router.post('/insertItem', upload.any(), async (req: Request, res: Response) => {
  const imageAssets = req.body.images;

  // Access the other properties from the formData
  const { place, category, description, ownerId } = req.body;


  console.log('imageAssets:', imageAssets);
  console.log('place', place);
  console.log('description', description);
  console.log('ownerId', ownerId);
  console.log('category', category);
  
  res.send(200);
  
  
  











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
