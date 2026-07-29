import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  username: string;
  email: string;
  profilePic?: string;
  bio?: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  savedRecipes: mongoose.Types.ObjectId[];
  archivedRecipes: mongoose.Types.ObjectId[];
  role: 'creator' | 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    profilePic: { type: String, default: '' },
    bio: { type: String, default: '' },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    savedRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    archivedRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    role: {
      type: String,
      enum: ['creator', 'user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
