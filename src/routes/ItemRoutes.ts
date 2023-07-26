import { storage } from '../config/firebase.config';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable, StorageReference, uploadString } from 'firebase/storage';
import express, { Request, Response, Router } from 'express';
import Item, { IItem } from '../models/ItemModel';
import User from '../models/UserModel';
import { promises as fsPromises } from 'fs'; // Import the 'fs' module for file operations
const { readFile } = fsPromises;
import mongoose from 'mongoose';
const router: Router = Router();
const XMLHttpRequest = require('xhr2');
console.log('Firebase Storage Bucket:', storage.app.options.storageBucket); // or console.log('Firebase Storage Bucket:', ref(storage, '/').toString());

interface ItemObj {
  category: string;
  place: string;
  description: string;
  ownerId: string;
}


router.get('/getpostimages', async (req: Request, res: Response) => {
const images: string[] = req.query.images as string[]; 
const storageref = ref(storage, `gs://lostandfound-f2f82.appspot.com/images/3135715.png    1690380121196`)
console.log(storageref);

//const imagefile = await getDownloadURL(storageref)
//console.log(imagefile);
res.status(200);


});



router.get('/', async (req: Request, res: Response) => {
  try {
    // Extract the startIndex from the query parameters, default to 0 if not provided
    const startIndex = parseInt(req.query.startIndex as string, 10) || 0;

    // Fetch the next 10 items from the database
    const items = await Item.find().skip(startIndex).limit(10);

    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



router.post('/insertItem', async (req: Request, res: Response) => {
  const images: Express.Multer.File[] = req.files as Express.Multer.File[];
  const { place, category, description, ownerId } = req.body;

  try {
    // Validate ownerId as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ error: 'Invalid ownerId' });
    }

    let imageUrls: string[] = [];
    for (const image of images) {
      try {
        const imageBuffer = await readFile(image.path);
        const uint8Array = new Uint8Array(imageBuffer);
  
        const imageRef = ref(storage, image.originalname);
        const storageImagesRef = ref(storage, `images/${image.originalname}`);
  
        await uploadBytes(storageImagesRef, uint8Array);
        const downloadUrl = await getDownloadURL(storageImagesRef);
        imageUrls = [...imageUrls, downloadUrl];
        console.log('File successfully uploaded');
      } catch (error) {
        console.error('Error uploading the image:', error);
      }
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

    res.status(200).json(imageUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;


