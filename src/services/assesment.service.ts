import AssesmentModel, {
  CreateAssesmentDto,
  UpdateAssesmentDto,
} from "../models/assesment.model";
import { MongoIdType } from "types/mongoid.type";

interface DashboardFilters {
  status?: string;
  frameworkType?: string;
  department?: string;
  priority?: string;
  search?: string;
  dateFrom?: number;
  dateTo?: number;
  startDateFrom?: number;
  startDateTo?: number;
  dueDateFrom?: number;
  dueDateTo?: number;
  page?: number;
  limit?: number;
}

const findById = async (id: string | MongoIdType) => {
  return await AssesmentModel.findById(id);
};

const create = async (payload: CreateAssesmentDto) => {
  return await AssesmentModel.create(payload);
};

const update = async (id: string | MongoIdType, data: UpdateAssesmentDto) => {
  return await AssesmentModel.findByIdAndUpdate(id, data);
};

const dashboardList = async (filters: DashboardFilters = {}) => {
  const {
    status,
    frameworkType,
    department,
    priority,
    search,
    dateFrom,
    dateTo,
    startDateFrom,
    startDateTo,
    dueDateFrom,
    dueDateTo,
    page = 1,
    limit = 10,
  } = filters;

  const query: any = {};

  if (status) query.status = status;
  if (frameworkType) query.frameworkType = frameworkType;
  if (department) query["departments.id"] = department;
  if (priority) query.priority = priority;

  if (search) {
    query.$or = [
      { frameworkName: { $regex: search, $options: "i" } },
      { controlId: { $regex: search, $options: "i" } },
      { controlName: { $regex: search, $options: "i" } },
    ];
  }

  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom * 1000);
    if (dateTo) query.createdAt.$lte = new Date(dateTo * 1000);
  }

  if (startDateFrom || startDateTo) {
    query.startDate = {};
    if (startDateFrom) query.startDate.$gte = startDateFrom;
    if (startDateTo) query.startDate.$lte = startDateTo;
  }

  if (dueDateFrom || dueDateTo) {
    query.dueDate = {};
    if (dueDateFrom) query.dueDate.$gte = dueDateFrom;
    if (dueDateTo) query.dueDate.$lte = dueDateTo;
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    AssesmentModel.find(query).sort({ _id: -1 }).skip(skip).limit(limit).lean(),
    AssesmentModel.countDocuments(query),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const findRecentByControlId = async (
  controlId: string,
  controlName?: string,
) => {
  const currentYear = new Date().getFullYear();
  const yearStart = new Date(currentYear, 0, 1);

  const query: any = {
    status: "closed",
    updatedAt: { $gte: yearStart },
  };

  if (controlName) {
    query.$or = [
      { controlId: controlId },
      { controlName: { $regex: controlName, $options: "i" } },
    ];
  } else {
    query.controlId = controlId;
  }

  return await AssesmentModel.find(query)
    .select(
      "name description frameworkName controlId controlName updatedAt status priority attachments",
    )
    .sort({ updatedAt: -1 })
    .limit(10)
    .lean();
};

export default {
  findById,
  create,
  update,
  dashboardList,
  findRecentByControlId,
};
