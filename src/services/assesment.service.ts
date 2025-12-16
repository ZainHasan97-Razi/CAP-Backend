import AssesmentModel, { CreateAssesmentDto, UpdateAssesmentDto } from "../models/assesment.model";
import { MongoIdType } from "types/mongoid.type";

const findById = async (id: string|MongoIdType) => {
  return await AssesmentModel.findById(id);
};

const create = async (payload: CreateAssesmentDto) => {
  return await AssesmentModel.create(payload);
};

const update = async (id: string|MongoIdType, data: UpdateAssesmentDto) => {
  return await AssesmentModel.findByIdAndUpdate(id, data);
};

export default {
  findById,
  create,
  update,
}