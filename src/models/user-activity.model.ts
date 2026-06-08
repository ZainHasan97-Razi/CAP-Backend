import mongoose, { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';
import { ExtractAndFix } from 'types/inferred.schema.type';

const TTL_DAYS = parseInt(process.env.USER_ACTIVITY_TTL_DAYS || '60', 10);
const TTL_SECONDS = TTL_DAYS * 24 * 60 * 60;

export const userActivitySchema = new Schema({
  userId:     { type: String, required: true, index: true },
  userName:   { type: String, required: true },
  email:      { type: String, required: true },
  role:       { type: String },
  department: { type: String },
  action:     { type: String },           // from X-Action header
  page:       { type: String },           // from X-Page-Name header
  apiUrl:     { type: String, required: true },
  method:     { type: String, required: true },
  statusCode: { type: Number },
  ipAddress:  { type: String },
  device: {
    browser:    { type: String },
    os:         { type: String },
    deviceType: { type: String },         // desktop | mobile | tablet
    userAgent:  { type: String },
  },
  timestamp: { type: Date, default: Date.now, index: true, expires: TTL_SECONDS },
});

export type UserActivitySchemaType = ExtractAndFix<InferSchemaType<typeof userActivitySchema>>;
export type UserActivityDocument = HydratedDocument<UserActivitySchemaType>;

const UserActivityModel = model('UserActivity', userActivitySchema);
export default UserActivityModel;
