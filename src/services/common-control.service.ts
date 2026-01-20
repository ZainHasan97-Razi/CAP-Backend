import CommonControlModel, { CreateCommonControlDto, UpdateCommonControlDto } from "../models/common-control.model";
import { MongoIdType } from "types/mongoid.type";

interface CommonControlListFilters {
  search?: string;
  frameworkId?: string;
  page?: number;
  limit?: number;
}

const findById = async (id: string|MongoIdType) => {
  return await CommonControlModel.findById(id)
    .populate('mappedControls.frameworkId', 'displayName')
    .populate('mappedControls.controlId', 'controlId displayName');
};

const create = async (data: CreateCommonControlDto) => {
  return await CommonControlModel.create(data);
};

const update = async (id: string|MongoIdType, data: UpdateCommonControlDto) => {
  return await CommonControlModel.findByIdAndUpdate(id, data, { new: true });
};

const list = async (filters: CommonControlListFilters = {}) => {
  const { search, frameworkId, page = 1, limit = 10 } = filters;
  
  const query: any = {};
  
  if (search) {
    query.$or = [
      { displayName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (frameworkId) {
    query['mappedControls.frameworkId'] = frameworkId;
  }
  
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    CommonControlModel.find(query)
      .populate('mappedControls.frameworkId', 'displayName')
      .populate('mappedControls.controlId', 'controlId displayName')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CommonControlModel.countDocuments(query)
  ]);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

const findByFramework = async (frameworkId: string|MongoIdType) => {
  return await CommonControlModel.find({
    'mappedControls.frameworkId': frameworkId
  }).populate('mappedControls.frameworkId', 'displayName')
    .populate('mappedControls.controlId', 'controlId displayName');
};

const findCommonControlsByControlId = async (controlId: string|MongoIdType) => {
  return await CommonControlModel.find({
    'mappedControls.controlId': controlId
  }).populate('mappedControls.frameworkId', 'displayName')
    .populate('mappedControls.controlId', 'controlId displayName');
};

export default {
  findById,
  create,
  update,
  list,
  findByFramework,
  findCommonControlsByControlId,
};