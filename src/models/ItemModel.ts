import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './UserModel';

export interface IItem extends Document {
  category: string;
  date: string;
  place: string;
  description: string;
  ownerId: Types.ObjectId | IUser;
  images: string[];
}

const itemSchema = new Schema<IItem>({
  category: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  images: [String],
});

const Item = mongoose.model<IItem>('Item', itemSchema);

export default Item;
