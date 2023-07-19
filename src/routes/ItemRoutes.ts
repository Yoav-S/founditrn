import express, { Request, Response } from 'express';
import Item, { IItem } from '../models/ItemModel';
import User from '../models/UserModel';
const router = express.Router();


interface ItemQueryParams {
  skip?: string;
  limit?: string;
}


router.get('/', async (req: Request<{}, {}, {}, ItemQueryParams>, res: Response) => {
  const { skip, limit } = req.query;

  try {
    const totalPosts = await Item.countDocuments();

    const skipValue = parseInt(skip ?? '0');
    const limitValue = parseInt(limit ?? '10');

    const posts = await Item.find().skip(skipValue).limit(limitValue);

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
