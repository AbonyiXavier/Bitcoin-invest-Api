import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { db } from "./../Database/connect"

export interface IProfile extends Document {
  image: string;
  phoneNumber: string;
  owner: IUser['_id'];
}

const ProfileSchema: Schema = new Schema({
  image: { type: String },
  phoneNumber: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, required: true }
},{ timestamps: true });

export const Profile = db.model<IProfile>('Profile', ProfileSchema);
