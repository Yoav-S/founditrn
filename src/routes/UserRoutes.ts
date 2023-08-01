import express, { Request, Response } from 'express';
import User, { IUser } from '../models/UserModel';
const bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Item, { IItem } from './../models/ItemModel';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find()
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});


router.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: IUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      items: [],
      img: null
    });

    const savedUser = await user.save();

    res.status(200).json({ message: 'Signup successful', user: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



router.get('/getitemsbyid', async (req: Request, res: Response) => {
  try {
    const { ownerId } = req.params;

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

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the hashed password
    const isPasswordValid: boolean = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Create a payload for the JWT
    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      items: user.items,
      img: user.img
    };

    // Create the JWT token with the payload and a secret key
    const secretKey = 'founditrntoken'; // Replace this with your actual secret key
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
    console.log(token);
    
    // Send the token in the response
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});




export default router;
