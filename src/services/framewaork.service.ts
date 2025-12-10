import FrameworkModel, { CreateFrameworkDto, UpdateFrameworkDto } from "../models/framework.model";
import { MongoIdType } from "types/mongoid.type";

const findById = async (id: string|MongoIdType) => {
  return await FrameworkModel.findById(id);
};

const create = async (user: CreateFrameworkDto) => {
  return await FrameworkModel.create(user);
};

const update = async (id: string|MongoIdType, data: UpdateFrameworkDto) => {
  return await FrameworkModel.findByIdAndUpdate(id, data);
};

export default {
  findById,
  create,
  update,
}