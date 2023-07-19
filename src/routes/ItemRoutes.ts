import express, { Request, Response } from 'express';
import Item, { IItem } from '../models/ItemModel';
import User from '../models/UserModel';
const router = express.Router();

// Route to get all items with pagination support
router.get('/', async (req: Request, res: Response) => {
  // Parse skip and limit from query parameters with proper types
  const skip: number = parseInt(req.query.skip as string);
  const limit: number = parseInt(req.query.limit as string);

  try {
    const totalPosts = await Item.countDocuments(); // Get the total count of posts

    // Fetch posts based on skip and limit
    const posts = await Item.find().skip(skip).limit(limit);

    res.status(200).json({ totalPosts, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Route to create a new item
router.post('/insertItem', (req : Request, res : Response) => {
  const { category, date, place, description, ownerId, images } = req.body;
  console.log(ownerId);
  // Ensure the types of the extracted parameters
  const categoryValue: string = category;
  const dateValue: Date = new Date(date);
  const placeValue: string = place;
  const descriptionValue: string = description;
  const ownerIdValue: string = ownerId;
  const imagesValue: (string | undefined)[] = images;

  const newItem = new Item({
    category: categoryValue,
    date: dateValue,
    place: placeValue,
    description: descriptionValue,
    ownerId: ownerIdValue,
    images: imagesValue,
  });
  
  
  // Save the new item to the database
  newItem.save()
    .then((savedItem) => {      
      // Populate the ownerId with the User document
      return User.findByIdAndUpdate(ownerId, { $push: { items: savedItem._id } }, { new: true });
    })
    .then(() => {
      res.status(200).json({message: 'Post Uploaded Successfully !'});
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    });

  });

export default router;
