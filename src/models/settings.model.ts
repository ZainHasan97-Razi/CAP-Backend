import { model, Schema } from 'mongoose';

const settingsSchema = new Schema(
  {
    aiEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SettingsModel = model('Settings', settingsSchema);
export default SettingsModel;
