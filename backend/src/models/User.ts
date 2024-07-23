import mongoose, { Schema, Document ,Model} from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'subscriber' }
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
