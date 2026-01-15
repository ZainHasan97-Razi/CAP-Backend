import DepartmentModel, { CreateDepartmentDto, DepartmentStatusEnum, UpdateDepartmentDto } from "../models/department.model";
import { MongoIdType } from "types/mongoid.type";

const findById = async (id: string|MongoIdType) => {
  return await DepartmentModel.findById(id);
};

const create = async (user: CreateDepartmentDto) => {
  return await DepartmentModel.create(user);
};

const update = async (id: string|MongoIdType, data: UpdateDepartmentDto) => {
  return await DepartmentModel.findByIdAndUpdate(id, data);
};

const findActiveDepts = async () => {
  return await DepartmentModel.find({status: DepartmentStatusEnum.active}).sort({displayName: -1})
  .select("displayName")
  .lean();
}

const findByIds = async (ids: (string|MongoIdType)[]) => {
  return await DepartmentModel.find({ _id: { $in: ids } });
};

export default {
  findById,
  findByIds,
  create,
  update,
  findActiveDepts,
}