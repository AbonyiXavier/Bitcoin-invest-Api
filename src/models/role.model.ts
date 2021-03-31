import mongoose, { Schema, Document } from 'mongoose';
import permissions from './../helpers/permission'
import { db } from "./../Database/connect"


export interface IRole extends Document {
    id: string;
    name: string;
    permission: string;
    description: string;
    ModifiedBy: ['_id'];
}

const RoleSchema = new Schema({
    name: { type: String, required: true, min: 3, max: 20 },
    permission: { 
        type: [String],
        enum: permissions,
        validate: (v: string | any[]) => Array.isArray(v) && v.length > 0, 
    },
    description: { type: String, required: true },
    ModifiedBy: { type: Schema.Types.ObjectId },
},{ timestamps: true })

export const Roles = db.model<IRole>('Roles', RoleSchema)
