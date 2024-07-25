import mongoose, { Document, Schema, Model } from 'mongoose';

interface IComment extends Document {
  text: string;
  user: mongoose.Types.ObjectId;
  news: mongoose.Types.ObjectId;
  date: Date;
}

const CommentSchema: Schema = new Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  news: { type: mongoose.Types.ObjectId, ref: 'News' },
  date: { type: Date, default: Date.now }
});

const Comment: Model<IComment> = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
