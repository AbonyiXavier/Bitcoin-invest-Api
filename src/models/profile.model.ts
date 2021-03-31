import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IProfile extends Document {
  image: string;
  owner: IUser['_id'];
}

const ProfileSchema: Schema = new Schema({
  image: { type: String, default: 'https://good-deed-app.s3-us-west-1.amazonaws.com/user.png' },
  phoneNumber: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, required: true }
},{ timestamps: true });

export default mongoose.model<IProfile>('Profile', ProfileSchema);