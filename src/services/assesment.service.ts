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

const dashboardList = async () => {
  return await AssesmentModel.find().sort({_id: -1})
  // .select("name description frameworkName controlName departmentName priority dueDate status")
  .lean();
}

export default {
  findById,
  create,
  update,
  dashboardList,
}