import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { IPlan } from './plan.model';
import { db } from './../Database/connect';

export interface ITransaction extends Document {
  amount: number;
  approved: boolean;
  txn_type: string;
  plan_type: string;
  monthly_rate: number;
  end_date: Date;
  status: string;
  owner: IUser['_id'];
  plan: IPlan['_id'];
}

const TransactionSchema: Schema = new Schema(
  {
    amount: { type: Number, required: true, default: 0 },
    approved: { type: Boolean, default: null },
    txn_type: {
      type: String,
      enum: ['deposit', 'withdraw'],
      default: 'deposit',
    },
    monthly_rate: { type: Number },
    end_date: { type: Date },
    status: { type: String },
    owner: { type: Schema.Types.ObjectId, required: true },
    plan: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export const Transaction = db.model<ITransaction>('Transaction', TransactionSchema);
