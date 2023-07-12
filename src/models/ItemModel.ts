import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
  category: string;
  date: string; // Change to string
  place: string;
  description: string;
  ownerId: string;
  images: (string | undefined)[];
}

const itemSchema = new Schema<IItem>({
  category: String,
  date: String, // Change to string
  place: String,
  description: String,
  ownerId: String,
  images: [String],
});

const Item = mongoose.model<IItem>('items', itemSchema);

export default Item;
