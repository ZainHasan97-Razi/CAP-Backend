import ControlModel, { ControlStatusEnum, CreateControlDto, UpdateControlDto } from "../models/control.model";
import { MongoIdType } from "types/mongoid.type";
import { sortControlsByControlCode } from "../utils/control.util";
import assesmentService from "./assesment.service";
import commonControlService from "./common-control.service";
import CommonControlModel from "../models/common-control.model";

const findById = async (id: string|MongoIdType) => {
  return await ControlModel.findById(id);
};

const create = async (data: CreateControlDto) => {
  return await ControlModel.create(data);
};

const update = async (id: string|MongoIdType, data: UpdateControlDto) => {
  return await ControlModel.findByIdAndUpdate(id, data);
};

const findActiveByFramework = async (frameworkId: MongoIdType|string, search?: string, status?: string) => {
  let query: any = {frameworkId};
  
  // Add status filter only if specified
  if (status) {
    query.status = status;
  }
  
  if (search) {
    query.$or = [
      { controlCode: { $regex: search, $options: 'i' } },
      { controlName: { $regex: search, $options: 'i' } }
    ];
  }
  
  const controls = await ControlModel.find(query)
    .select("controlCode controlName domainCode domainName subdomainCode subdomainName status")
    .lean();
  
  return sortControlsByControlCode(controls);
}

const findByControlCodeWithAssessments = async (controlCode: string) => {
  const control = await ControlModel.findOne({ controlCode }).lean();
  
  if (!control) return null;
  
  const commonControls = await CommonControlModel.find({
    'mappedControls.controlId': control._id
  }).select('mappedControls').lean();
  
  const relatedControlIds: MongoIdType[] = [control._id];
  
  commonControls.forEach(cc => {
    cc.mappedControls.forEach(mc => {
      if (mc.controlId.toString() !== control._id.toString()) {
        relatedControlIds.push(mc.controlId as any);
      }
    });
  });
  
  const recentAssessments = await assesmentService.findRecentByMultipleControlIds(relatedControlIds);
  
  return {
    ...control,
    recentAssessments
  };
};

const findByControlCode = async (controlCode: string) => {
  return await ControlModel.findOne({ controlCode }).lean();
};

export default {
  findById,
  create,
  update,
  findActiveByFramework,
  findByControlCode,
  findByControlCodeWithAssessments,
}