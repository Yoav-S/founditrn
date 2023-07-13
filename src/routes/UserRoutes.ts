import express, { Request, Response } from 'express';
import User, { IUser } from '../models/UserModel';

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
  const newUser: IUser = new User({
    name: 'John Doe',
    password: 'password123',
    email: 'john@example.com',
    phone: '1234567890',
    items: [],
    img: null,
  });
  
  // Save the new user to the database
  newUser.save()
    .then((savedUser) => {
      console.log('User saved:', savedUser);
    })
    .catch((error) => {
      console.error('Error saving user:', error);
    });
  console.log('user');
  try {
    const users: IUser[] = await User.find().populate('items');
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
  });

export default router;
