import mongoose, { Schema, Document ,Model} from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  subscriptions: mongoose.Types.ObjectId[];
  savedNews: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'subscriber'], default: 'subscriber' }, 
  subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  savedNews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }]

});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;