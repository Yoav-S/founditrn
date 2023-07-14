import express, { Request, Response } from 'express';
import User, { IUser } from '../models/UserModel';
const bcrypt = require('bcrypt');
const router = express.Router();

// Route to get a user by ID
router.get('users/:id', async (req: Request, res: Response) => {
// const { id } = req.params;
// try {
//   const user: IUser | null = await User.findById(id);
//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }
//   return res.json(user);
// } catch (error) {
//   return res.status(500).json({ error: 'Server error' });
// }
});

// Route to get all users

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
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password using the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user instance with the hashed password and empty items array
    const user: IUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      items: [],
      img: null
    });

    // Save the user to the database
    const savedUser = await user.save();
    console.log('user', user)

    res.status(200).json({ message: 'Signup successful', user: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Password is valid, perform further actions (e.g., generate a token)

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
