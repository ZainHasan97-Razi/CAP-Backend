import AssesmentModel, { CreateAssesmentDto, UpdateAssesmentDto } from "../models/assesment.model";
import { MongoIdType } from "types/mongoid.type";

const findById = async (id: string|MongoIdType) => {
  return await AssesmentModel.findById(id);
};

const create = async (user: CreateAssesmentDto) => {
  return await AssesmentModel.create(user);
};

const update = async (id: string|MongoIdType, data: UpdateAssesmentDto) => {
  return await AssesmentModel.findByIdAndUpdate(id, data);
};

export default {
  findById,
  create,
  update,
}