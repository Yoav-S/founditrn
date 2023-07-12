import mongoose,{ Document, Schema, ConnectOptions } from 'mongoose';
import { IItem } from './ItemModel';


const mongoURI = 'mongodb://127.0.0.1:27017/founditpracticedb';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected');
    // Start your server or perform other operations
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    // Handle the connection error
  });


export interface IUser extends Document {
  name: string;
  password: string;
  email: string;
  phone: string;
  items: IItem[];
  img?: string | null;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: 'items',
    },
  ],
  img: String,
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
 