import ControlModel, { ControlStatusEnum, CreateControlDto, UpdateControlDto } from "../models/control.model";
import { MongoIdType } from "types/mongoid.type";

const findById = async (id: string|MongoIdType) => {
  return await ControlModel.findById(id);
};

const create = async (data: CreateControlDto) => {
  return await ControlModel.create(data);
};

const update = async (id: string|MongoIdType, data: UpdateControlDto) => {
  return await ControlModel.findByIdAndUpdate(id, data);
};

const findActiveByFramework = async (frameworkId: MongoIdType|string) => {
  return await ControlModel.find({frameworkId, status: ControlStatusEnum.active})
    .select("controlId displayName groupId groupName")
    .lean();
}

export default {
  findById,
  create,
  update,
  findActiveByFramework,
}