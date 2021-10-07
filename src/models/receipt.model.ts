import mongoose, { Schema, Document } from 'mongoose';
import { db } from "../Database/connect"


export interface IReceipt extends Document {
    full_name: string; 
    txn_type: string;
    total_amount: number;
    createdAt: Date;
}

const ReceiptSchema: Schema = new Schema({
 full_name: {type: String },
 txn_type: {type: String },
 total_amount: { type: Number },
 createdAt: { type: Date, default: Date.now  },
});

export const Receipt = db.model<IReceipt>('Receipt', ReceiptSchema);
