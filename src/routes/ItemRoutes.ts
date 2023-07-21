import { Request, Response, Router } from 'express';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import config from '../config/firebase.config';
import Item, { IItem } from '../models/ItemModel';
import User from '../models/UserModel';

const storage = getStorage();
const router: Router = Router();

// Initialize Firebase app
initializeApp(config.firebaseConfig);

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
  const imageAssets = req.body.images as Express.Multer.File[]; // Access the image assets array
  const { place, category, description, ownerId } = req.body; // Destructure other properties

  console.log('imageAssets:', imageAssets); // Log the image assets
  console.log('place:', place);
  console.log('category:', category);
  console.log('description:', description);
  console.log('ownerId:', ownerId);

  // Now, you can proceed to upload each image to the "images" folder in Firebase Storage
  const imageUrls = [];

  for (const image of imageAssets) {
    const storageRef = ref(storage, `images/${image.originalname}`);

    try {
      // Upload the image to Firebase Storage
      const snapshot = await uploadBytes(storageRef, image.buffer);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Push the download URL to the imageUrls array
      imageUrls.push(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
      return res.status(500).json({ error: 'Error uploading image' });
    }
  }

  try {
    // Create your item object and store the imageUrls in the database, if needed
    const newItem: IItem = new Item({
      category,
      place,
      description,
      ownerId,
      images: imageUrls, // Store the array of image URLs in the "images" property of the item object
    });

    // Save the new item to the database
    const savedItem = await newItem.save();

    // Populate the ownerId with the User document
    await User.findByIdAndUpdate(ownerId, { $push: { items: savedItem._id } }, { new: true });

    return res.status(200).json({ message: 'Item created successfully', item: savedItem });
  } catch (error) {
    console.error('Error creating item:', error);
    return res.status(500).json({ error: 'Error creating item' });
  }
});

export default router;
