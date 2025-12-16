import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

export const DepartmentStatusEnum = {
  active: "active",
  inactive: "inactive"
} as const
export type DepartmentStatusEnumType = keyof typeof DepartmentStatusEnum;

// Departments are primarily made to search user when creating an assismnent accordingly
export const departmentSchema = new Schema(
  {
    displayName: {type: String, required: true},
    status: { type: String, enum: DepartmentStatusEnum, default: DepartmentStatusEnum.active },
  },
  { timestamps: true },
);

export type DepartmentSchemaType = InferSchemaType<typeof departmentSchema>;
export type DepartmentDocument = HydratedDocument<DepartmentSchemaType>;
export type CreateDepartmentDto = Omit<DepartmentSchemaType, "createdAt" | "updatedAt" | "status">;
export type UpdateDepartmentDto = Omit<DepartmentSchemaType, "createdAt" | "updatedAt">;

const DepartmentModel = model('Department', departmentSchema);
export default DepartmentModel;
