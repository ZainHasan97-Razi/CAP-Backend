import mongoose, { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';
import { ExtractAndFix } from 'types/inferred.schema.type';

export const systemLogSchema = new Schema(
  {
    operation: { type: String, required: true },
    controllerName: { type: String },
    serviceName: { type: String },
    apiUrl: { type: String },
    responseCode: { type: Number },
    requestData: { type: Schema.Types.Mixed },
    responseData: { type: Schema.Types.Mixed },
    userId: { type: String },
    createdAt: { type: Date, default: Date.now, expires: 2592000 } // 30 days TTL
  }
);

export type SystemLogSchemaType = ExtractAndFix<InferSchemaType<typeof systemLogSchema>>;
export type SystemLogDocument = HydratedDocument<SystemLogSchemaType>;
export type CreateSystemLogDto = Omit<SystemLogSchemaType, "createdAt">;

const SystemLogModel = model('SystemLog', systemLogSchema);
export default SystemLogModel;