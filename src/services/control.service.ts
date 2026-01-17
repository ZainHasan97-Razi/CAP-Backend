import ControlModel, { ControlStatusEnum, CreateControlDto, UpdateControlDto } from "../models/control.model";
import { MongoIdType } from "types/mongoid.type";
import { sortControlsByControlId } from "../utils/control.util";
import assesmentService from "./assesment.service";

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
  const controls = await ControlModel.find({frameworkId, status: ControlStatusEnum.active})
    .select("controlId displayName groupId groupName")
    .lean();
  
  return sortControlsByControlId(controls);
}

const findByControlIdWithAssessments = async (controlId: string) => {
  const control = await ControlModel.findOne({ controlId }).lean();
  
  if (!control) return null;
  
  const recentAssessments = await assesmentService.findRecentByControlId(controlId, control.displayName);
  
  return {
    ...control,
    recentAssessments
  };
};

const findByControlId = async (controlId: string) => {
  return await ControlModel.findOne({ controlId }).lean();
};

export default {
  findById,
  create,
  update,
  findActiveByFramework,
  findByControlId,
  findByControlIdWithAssessments,
}