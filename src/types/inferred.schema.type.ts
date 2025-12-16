import mongoose, { InferSchemaType, Schema, Types } from 'mongoose';

// This matches the constructor type exactly
type ObjectIdConstructor = {
  prototype?: Types.ObjectId | null | undefined;
  cacheHexString?: unknown;
  generate?: {} | null | undefined;
  createFromTime?: {} | null | undefined;
  createFromHexString?: {} | null | undefined;
  createFromBase64?: {} | null | undefined;
  isValid?: {} | null | undefined;
};

// Main transformer
type FixedInferSchemaType<T> = {
  [K in keyof T]: 
  T[K] extends ObjectIdConstructor
  ? Types.ObjectId
  : T[K] extends (infer U)[]
  ? U extends ObjectIdConstructor
  ? Types.ObjectId[]
  : U[]
  : T[K];
};

// Type to handle the intersection (& mongoose.DefaultTimestampProps)
export type ExtractAndFix<T> = T extends infer U & mongoose.DefaultTimestampProps
  ? FixedInferSchemaType<U> & mongoose.DefaultTimestampProps
  : FixedInferSchemaType<T>;