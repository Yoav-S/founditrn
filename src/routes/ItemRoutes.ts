import { storage } from '../config/firebase.config';
import { ref, uploadBytes, listAll, getDownloadURL, uploadBytesResumable, StorageReference, uploadString } from 'firebase/storage';
import express, { Request, Response, Router } from 'express';
import Item, { IItem } from '../models/ItemModel';
import User from '../models/UserModel';
import { promises as fsPromises } from 'fs'; // Import the 'fs' module for file operations
const { readFile } = fsPromises;
import mongoose from 'mongoose';
const router: Router = Router();
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

    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/getitemsbyid/:ownerId', async (req: Request, res: Response) => {
  try {
    const {ownerId} = req.params;   
    // Make sure the provided ownerId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ error: 'Invalid ownerId' });
    }

    // Query the database to find all items with the given ownerId
    const items: IItem[] = await Item.find({ ownerId });
    
    // Send the array of items as a response
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/insertItem', async (req: Request, res: Response) => {
  const images: Express.Multer.File[] = req.files as Express.Multer.File[];
  const { place, category, description, ownerId } = req.body;
  console.log(images);
  
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
        const storageImagesRef = ref(storage, `images/itemsimages/${image.originalname}`);
        imageRef.name === storageImagesRef.name
        imageRef.fullPath === storageImagesRef.fullPath
        await uploadBytes(storageImagesRef, uint8Array).then((response) => {
          console.log('response', response);
        })
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

router.delete('/deleteitembyid/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Search for the item in the MongoDB Item model using the provided id and delete it
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Now, update the user's items array in the User collection
    const { ownerId } = deletedItem; // Assuming `ownerId` is the property that holds the user's id in the Item model
    await User.findOneAndUpdate({ _id: ownerId }, { $pull: { items: id } });

    // If the item is found and deleted successfully, send a success message
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;


