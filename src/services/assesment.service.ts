import AssesmentModel, {
  CreateAssesmentDto,
  UpdateAssesmentDto,
  AssesmentStatusEnum,
} from "../models/assesment.model";
import { MongoIdType } from "types/mongoid.type";
import assesmentCommentService from "./assesment-comment.service";
import systemLogService from "./system-log.service";

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

const create = async (payload: CreateAssesmentDto & { commonAssessmentId?: string }, userId: string, userName: string) => {
  const { commonAssessmentId, ...assessmentData } = payload;
  
  // Create assessment data with status
  const createData = {
    ...assessmentData,
    ...(commonAssessmentId && { status: AssesmentStatusEnum.in_progress })
  };
  
  // Create the assessment first
  const assessment = await AssesmentModel.create(createData);
  
  // Copy comments if commonAssessmentId is provided
  if (commonAssessmentId) {
    try {
      await assesmentCommentService.copyCommentsFromAssessment(
        commonAssessmentId,
        assessment._id,
        userId,
        userName
      );
    } catch (error) {
      // Log the error but don't fail the assessment creation
      await systemLogService.logError("copy_assessment_comments", error, {
        serviceName: "AssessmentService",
        requestData: { sourceAssessmentId: commonAssessmentId, targetAssessmentId: assessment._id },
        userId
      });
    }
  }
  
  return assessment;
};

const update = async (id: string | MongoIdType, data: UpdateAssesmentDto) => {
  return await AssesmentModel.findByIdAndUpdate(id, data, { new: true });
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

const findRecentByMultipleControlIds = async (
  controlIds: (string | MongoIdType)[]
) => {
  const currentYear = new Date().getFullYear();
  const yearStart = new Date(currentYear, 0, 1);

  return await AssesmentModel.find({
    control: { $in: controlIds },
    status: "closed",
    updatedAt: { $gte: yearStart },
  })
    .select(
      "name description frameworkName controlId controlName updatedAt status priority attachments",
    )
    .sort({ updatedAt: -1 })
    .limit(10)
    .lean();
};

const getAnalytics = async (filters: { startDate?: number; endDate?: number } = {}) => {
  const { startDate, endDate } = filters;
  const currentTime = Math.floor(Date.now() / 1000);
  
  const matchStage: any = {};
  
  if (startDate) {
    matchStage.startDate = { $gte: startDate };
  }
  if (endDate) {
    matchStage.dueDate = { $lte: endDate };
  }
  
  const pipeline = [
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    {
      $group: {
        _id: "$assesmentId",
        priority: { $first: "$priority" },
        dueDate: { $first: "$dueDate" },
        statuses: { $push: "$status" },
        totalControls: { $sum: 1 },
        closedControls: {
          $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] }
        },
        inProgressControls: {
          $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] }
        }
      }
    },
    {
      $addFields: {
        assessmentStatus: {
          $cond: [
            { $eq: ["$closedControls", "$totalControls"] },
            "closed",
            {
              $cond: [
                { $gt: ["$inProgressControls", 0] },
                "in_progress",
                "open"
              ]
            }
          ]
        },
        isOverdue: {
          $and: [
            { $lt: ["$dueDate", currentTime] },
            { $ne: ["$closedControls", "$totalControls"] }
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        totalAssessments: { $sum: 1 },
        completedAssessments: {
          $sum: { $cond: [{ $eq: ["$assessmentStatus", "closed"] }, 1, 0] }
        },
        inProgressAssessments: {
          $sum: { $cond: [{ $eq: ["$assessmentStatus", "in_progress"] }, 1, 0] }
        },
        openAssessments: {
          $sum: { $cond: [{ $eq: ["$assessmentStatus", "open"] }, 1, 0] }
        },
        overdueAssessments: {
          $sum: { $cond: ["$isOverdue", 1, 0] }
        },
        compliantControls: {
          $sum: { $cond: [{ $ne: ["$assessmentStatus", "closed"] }, "$closedControls", 0] }
        },
        nonCompliantControls: {
          $sum: { $cond: [{ $ne: ["$assessmentStatus", "closed"] }, "$inProgressControls", 0] }
        },
        highPriority: {
          $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] }
        },
        mediumPriority: {
          $sum: { $cond: [{ $eq: ["$priority", "medium"] }, 1, 0] }
        },
        lowPriority: {
          $sum: { $cond: [{ $eq: ["$priority", "low"] }, 1, 0] }
        }
      }
    }
  ];
  
  const result = await AssesmentModel.aggregate(pipeline);
  
  if (result.length === 0) {
    return {
      totalAssessments: 0,
      completedAssessments: 0,
      inProgressAssessments: 0,
      openAssessments: 0,
      overdueAssessments: 0,
      compliantControls: 0,
      nonCompliantControls: 0,
      priorityDistribution: {
        high: 0,
        medium: 0,
        low: 0
      }
    };
  }
  
  const data = result[0];
  return {
    totalAssessments: data.totalAssessments,
    completedAssessments: data.completedAssessments,
    inProgressAssessments: data.inProgressAssessments,
    openAssessments: data.openAssessments,
    overdueAssessments: data.overdueAssessments,
    compliantControls: data.compliantControls,
    nonCompliantControls: data.nonCompliantControls,
    priorityDistribution: {
      high: data.highPriority,
      medium: data.mediumPriority,
      low: data.lowPriority
    }
  };
};

export default {
  findById,
  create,
  update,
  dashboardList,
  findRecentByControlId,
  findRecentByMultipleControlIds,
  getAnalytics,
};
