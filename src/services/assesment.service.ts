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

interface DashboardFilters {
  status?: string;
  department?: string;
  priority?: string;
  dateFrom?: number;
  dateTo?: number;
  dueDateFrom?: number;
  dueDateTo?: number;
  page?: number;
  limit?: number;
}

const dashboardList = async (filters: DashboardFilters = {}) => {
  const { status, department, priority, dateFrom, dateTo, dueDateFrom, dueDateTo, page = 1, limit = 10 } = filters;
  
  const query: any = {};
  
  if (status) query.status = status;
  if (department) query.department = department;
  if (priority) query.priority = priority;
  
  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom * 1000);
    if (dateTo) query.createdAt.$lte = new Date(dateTo * 1000);
  }
  
  if (dueDateFrom || dueDateTo) {
    query.dueDate = {};
    if (dueDateFrom) query.dueDate.$gte = dueDateFrom;
    if (dueDateTo) query.dueDate.$lte = dueDateTo;
  }
  
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    AssesmentModel.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    AssesmentModel.countDocuments(query)
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
}

export default {
  findById,
  create,
  update,
  dashboardList,
}