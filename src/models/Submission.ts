import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubmission extends Document {
  id: string;
  name: string;
  role: string;
  title?: string;
  theme?: string;
  imageUrl?: string;
  createdAt: Date;
}

const SubmissionSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  title: { type: String },
  theme: { type: String },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Guard against duplicate model creation during dev recompilations
const Submission: Model<ISubmission> =
  mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;
