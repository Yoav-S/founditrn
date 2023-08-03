import express, { Request, Response } from 'express';
import User, { IUser } from '../models/UserModel';
const bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken';
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

router.patch('/updatename', async (req: Request, res: Response) => {
  const { name, id } = req.params;
  console.log(name);
  console.log(id);
  
  
  try {
    // Find the user by ID
    const user: IUser | null = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's name
    user.name = name;
    await user.save();

    return res.status(200).json({ message: 'Name updated successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});


router.patch('/updatepassword', async (req: Request, res: Response) => {
  const { password, id } = req.params;

  try {
    // Find the user by ID
    const user: IUser | null = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's name
    user.password = password;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});


router.patch('/updatephone', async (req: Request, res: Response) => {
  const { phone, id } = req.params;

  try {
    // Find the user by ID
    const user: IUser | null = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's name
    user.phone = phone;
    await user.save();

    return res.status(200).json({ message: 'Phone number updated successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});



router.get('/getuserbyownerid/:ownerid', async (req: Request, res: Response) => {
  const { ownerid } = req.params;
  try {
    // Search for the user in the MongoDB User model using the provided ownerId
    const user = await User.findOne({ _id: ownerid }, { name: 1, email: 1, phone: 1 });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If the user is found, send the user object containing only name, email, and phone properties
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
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
