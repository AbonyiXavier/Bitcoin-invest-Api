import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { db } from './../Database/connect';

export interface IWithdraw extends Document {
  wallet_address: string;
  amount: number;
  approved: string;
  owner: IUser['_id'];
}

const WithdrawSchema: Schema = new Schema(
  {
    wallet_address: { type: String, required: true },
    amount: { type: Number, required: true },
    approved: { type: String },
    owner: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export const Withdraw = db.model<IWithdraw>('Withdraw', WithdrawSchema);
