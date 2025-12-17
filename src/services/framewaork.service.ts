import FrameworkModel, { CreateFrameworkDto, FrameworkDocument, FrameworkStatusEnum, UpdateFrameworkDto } from "../models/framework.model";
import { MongoIdType } from "types/mongoid.type";

const findById = async (id: string|MongoIdType): Promise<FrameworkDocument|null> => {
  return await FrameworkModel.findById(id);
};

const create = async (user: CreateFrameworkDto) => {
  return await FrameworkModel.create(user);
};

const update = async (id: string|MongoIdType, data: UpdateFrameworkDto) => {
  return await FrameworkModel.findByIdAndUpdate(id, data);
};

const findAllActive = async () => {
  return await FrameworkModel.find({status: FrameworkStatusEnum.active}).select("displayName").lean();
}

export default {
  findById,
  create,
  update,
  findAllActive
}