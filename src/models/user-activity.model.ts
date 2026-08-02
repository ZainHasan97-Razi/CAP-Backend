import mongoose, { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';
import { ExtractAndFix } from 'types/inferred.schema.type';

const TTL_DAYS = parseInt(process.env.USER_ACTIVITY_TTL_DAYS || '60', 10);
const TTL_SECONDS = TTL_DAYS * 24 * 60 * 60;

export const EventTypeEnum = {
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION:  'AUTHORIZATION',
  USER_ACTION:    'USER_ACTION',
  ADMIN_ACTION:   'ADMIN_ACTION',
  CONFIG_CHANGE:  'CONFIG_CHANGE',
  ASSESSMENT:     'ASSESSMENT',
  EVIDENCE:       'EVIDENCE',
} as const;
export type EventTypeEnumType = keyof typeof EventTypeEnum;

export const userActivitySchema = new Schema({
  userId:     { type: String, required: true, index: true },
  userName:   { type: String, required: true },
  email:      { type: String, required: true },
  role:       { type: String },
  department: { type: String },
  action:     { type: String },
  page:       { type: String },
  apiUrl:     { type: String, required: true },
  method:     { type: String, required: true },
  statusCode: { type: Number },
  ipAddress:  { type: String },
  device: {
    browser:    { type: String },
    os:         { type: String },
    deviceType: { type: String },
    userAgent:  { type: String },
  },
  // Structured audit fields
  eventType:     { type: String, enum: Object.values(EventTypeEnum) },
  eventSubtype:  { type: String },
  sessionId:     { type: String },
  resourceType:  { type: String },
  resourceId:    { type: String },
  result:        { type: String, enum: ['SUCCESS', 'FAILURE', 'DENIED'] },
  failureReason: { type: String },
  beforeValue:   { type: Schema.Types.Mixed },
  afterValue:    { type: Schema.Types.Mixed },
  logHash:       { type: String },
  timestamp: { type: Date, default: Date.now, index: true, expires: TTL_SECONDS },
});

export type UserActivitySchemaType = ExtractAndFix<InferSchemaType<typeof userActivitySchema>>;
export type UserActivityDocument = HydratedDocument<UserActivitySchemaType>;

const UserActivityModel = model('UserActivity', userActivitySchema);
export default UserActivityModel;
