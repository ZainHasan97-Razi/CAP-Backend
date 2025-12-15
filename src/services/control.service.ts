import ControlModel, { CreateControlDto, UpdateControlDto } from "../models/control.model";
import { MongoIdType } from "types/mongoid.type";

const findById = async (id: string|MongoIdType) => {
  return await ControlModel.findById(id);
};

const create = async (data: CreateControlDto) => {
  console.log("comingggggggggg");
  
  return await ControlModel.create(data);
};

const update = async (id: string|MongoIdType, data: UpdateControlDto) => {
  return await ControlModel.findByIdAndUpdate(id, data);
};

export default {
  findById,
  create,
  update,
}