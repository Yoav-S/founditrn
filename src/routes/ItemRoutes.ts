import express, { Request, Response } from 'express';
import Item, { IItem } from '../models/ItemModel';
import User from '../models/UserModel';
const router = express.Router();

// Route to get all items
router.get('/', (req, res) => {
    // Handle GET request for items
  });

// Route to create a new item
router.post('/insertItem', (req : Request, res : Response) => {
  const { category, date, place, description, ownerId, images } = req.body;
  console.log(category);
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
  
  console.log('arrived 32');
  
  // Save the new item to the database
  newItem.save()
    .then((savedItem) => {
      console.log('saved');
      
      // Populate the ownerId with the User document
      return User.findByIdAndUpdate(ownerId, { $push: { items: savedItem._id } }, { new: true });
    })
    .then(() => {
      res.status(200).json(newItem);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    });

  });

export default router;
