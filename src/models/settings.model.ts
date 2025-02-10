import { Schema, model, Document } from 'mongoose';

// Interface for the app details
interface AppDetails {
  name: string;
  version: string;
  releaseDate: Date;
  isNewVersionAvailable: boolean;
}

// Interface for the main settings model
export interface SettingsModel extends Document {
  availableBalance: number;
  hideBalance: boolean;
  lang: 'en' | 'ko' | 'th';
  darkMode: boolean;
  appDetails: AppDetails;
}

// Subschema for app details
const appDetailsSchema = new Schema(
  {
    name: { type: String, required: true },
    version: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    isNewVersionAvailable: { type: Boolean, required: true }
  },
  { _id: false } // Avoid creating an ID for this subschema
);

// Main settings schema
const settingsSchema = new Schema<SettingsModel>(
  {
    availableBalance: {
      type: Number,
      required: true,
      min: 0, // Balance must be non-negative
    },
    hideBalance: {
      type: Boolean,
      required: true,
      default: false
    },
    lang: {
      type: String,
      enum: ['en', 'ko', 'th'], // Restrict to predefined options
      required: true,
    },
    darkMode: {
      type: Boolean,
      required: true,
      default: false, // Default value for darkMode
    },
    appDetails: {
      type: appDetailsSchema, // Reference the subschema
      required: true,
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
  }
);

// Export the model
const Settings = model<SettingsModel>('Settings', settingsSchema);
export default Settings;
