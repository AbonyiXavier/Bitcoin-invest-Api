import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

import { db } from './../Database/connect';

export interface IReferal extends Document {
  userName: string;
  referalUrl: string;
  owner: IUser['_id'];
}

const ReferalSchema: Schema = new Schema(
  {
    userName: { type: String, required: true },
    referalUrl: { type: String, default: '' },
    owner: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export const Referal = db.model<IReferal>('Referal', ReferalSchema);
