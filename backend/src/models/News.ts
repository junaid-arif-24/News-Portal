import mongoose, { Schema, Document } from 'mongoose';

interface INews extends Document {
  title: string;
  description: string;
  images: string[];
  date: Date;
  time: string;
  tags: string[];
  category: mongoose.Schema.Types.ObjectId;
  visibility: 'public' | 'private';
}

const NewsSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  date: { type: Date, default: Date.now },
  time: { type: String, required: true },
  tags: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' }
});

const News = mongoose.model<INews>('News', NewsSchema);

export default News;