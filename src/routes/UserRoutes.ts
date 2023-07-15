import express, { Request, Response } from 'express';
import User, { IUser } from '../models/UserModel';
const bcrypt = require('bcrypt');
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


router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(typeof req.body);
  
  try {
    const user = await User.findOne({ email });
    console.log(user);
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});




export default router;
