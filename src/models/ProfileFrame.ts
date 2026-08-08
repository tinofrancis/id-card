import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProfileFrame extends Document {
  id: string;
  theme: string;
  imageUrl: string;
  createdAt: Date;
}

const ProfileFrameSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  theme: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Register the model, forcing collection name to 'profile_frames' in MongoDB Atlas
const ProfileFrame: Model<IProfileFrame> =
  mongoose.models.ProfileFrame || mongoose.model<IProfileFrame>('ProfileFrame', ProfileFrameSchema, 'profile_frames');

export default ProfileFrame;
