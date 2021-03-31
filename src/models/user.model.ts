
import mongoose, { Schema, Document } from 'mongoose';
import {  hashPassword, passwordCompare } from "./../helpers/auth.service"
import { db } from "./../Database/connect"

// export enum UserRole {
//   User = 'user',
//   Admin = 'admin',
// }
export interface IUser extends Document {
      id: string;
      name: string;
      email: string;
      password: string;
      confirm_password: string;
      emailConfirm: boolean;
      blocked: boolean | null;
      // role: UserRole;
    }

const UserSchema: Schema = new Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      emailConfirm: { type: Boolean, default: false },
      blocked: { type: Boolean, default: false },
      // role: {
      //   type: String,
      //   enum: Object.values(UserRole),
      //   default: UserRole.User,
      //   required: true,
      // },
    },{ timestamps: true });

    // Hash Password To DB
    UserSchema.pre<IUser>('save', async function (next: mongoose.HookNextFunction) {
      const userDocument = this;
      const user = userDocument.toObject();
    
      if (!userDocument.isModified('password')) {
        return next();
      }
      try {
        const hash = await hashPassword(user.password);
        userDocument.password = hash;
        return next();
      } catch (error) {
        return next(error);
      }
    });

// Export the model and return your IUser interface
export const User = db.model<IUser>('User', UserSchema);
