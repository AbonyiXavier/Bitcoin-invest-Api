import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { db } from "./../Database/connect"

export interface ITransaction extends Document {
  txn_id: string; 
  wallet_address: string;
  amount: number;
  approved: boolean;
  txn_type: string;
  owner: IUser['_id'];
}

const TransactionSchema: Schema = new Schema({
  txn_id: { type: String, required: true },  
  wallet_address: { type: String, required: true },
  amount: { type: Number, required: true },
  approved: { type: Boolean, default: null },
  txn_type: {
    type: String,
    enum: ["deposit", "withdraw"],
},
  owner: { type: Schema.Types.ObjectId, required: true },
}, { timestamps: true });

export const Transaction = db.model<ITransaction>('Transaction', TransactionSchema);
