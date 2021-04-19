import mongoose, { Schema, Document } from 'mongoose';
import permissions from './../helpers/permission';
import { IUser } from './user.model';
import { db } from './../Database/connect';

export interface IRole extends Document {
  name: string;
  permissions: string[];
  description: string;
  ModifiedBy: IUser['_id'];
}

const RoleSchema = new Schema(
  {
    name: { type: String, required: true, min: 3, max: 20 },
    permissions: {
      type: [String],
      enum: permissions,
      validate: (v: string | any[]) => Array.isArray(v) && v.length > 0,
    },
    description: { type: String, required: true },
    ModifiedBy: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export const Roles = db.model<IRole>('Roles', RoleSchema);
