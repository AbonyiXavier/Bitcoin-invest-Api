import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface ITransaction extends Document {
  transaction_id: string; 
  wallet_address: string;
  amount: number;
  approved: boolean;
  txn_type: string;
  owner: IUser['_id'];
  CreadtedBy: IUser['_id']
}

const TransactionSchema: Schema = new Schema({
  transaction_id: { type: String, required: true },  
  wallet_address: { type: String, required: true },
  amount: { type: Number, required: true },
  approved: { type: Boolean, default: null },
  txn_type: {
    type: String,
    enum: ["deposit", "withdraw"],
    // default: "pending",
},
  owner: { type: Schema.Types.ObjectId, required: true },
  CreadtedBy: { type: Schema.Types.ObjectId,  required: true },
}, { timestamps: true });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);