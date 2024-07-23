import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
  name: string;
  description: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true }
});

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
