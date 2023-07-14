import mongoose, { Document, Schema } from 'mongoose';
import { IItem } from './ItemModel';
const mongoUri = "mongodb+srv://yoavsh444:yoavyoav1@cluster0.xonnk2r.mongodb.net/founditDB"

mongoose 
 .connect(mongoUri)   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

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
  items: {
    type: [Schema.Types.ObjectId],
    ref: 'Item',
    default: [],
  },
  img: {
    type: String,
    default: undefined,
  },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
