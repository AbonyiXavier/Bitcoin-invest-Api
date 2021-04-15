import mongoose, { Schema, Document } from 'mongoose';
import { db } from "./../Database/connect"


export interface IPlan extends Document {
    name: string; 
    interest_rate: number;
}

const PlanSchema: Schema = new Schema({
 name: {type: String,  required: true },
 interest_rate: { type: Number },
}, { timestamps: true });

export const Plan = db.model<IPlan>('Plan', PlanSchema);
