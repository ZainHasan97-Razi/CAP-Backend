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
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
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
        frameworkName: { $first: "$frameworkName" },
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
        }
      }
    },
    {
      $group: {
        _id: null,
        completedAssessments: {
          $sum: { $cond: [{ $eq: ["$assessmentStatus", "closed"] }, 1, 0] }
        },
        compliantControls: {
          $sum: { $cond: [{ $ne: ["$assessmentStatus", "closed"] }, "$closedControls", 0] }
        },
        nonCompliantControls: {
          $sum: { $cond: [{ $ne: ["$assessmentStatus", "closed"] }, "$inProgressControls", 0] }
        },
        frameworks: {
          $push: {
            name: "$frameworkName",
            status: "$assessmentStatus",
            totalControls: "$totalControls",
            closedControls: "$closedControls"
          }
        }
      }
    }
  ];
  
  const result = await AssesmentModel.aggregate(pipeline);
  
  if (result.length === 0) {
    return {
      completedAssessments: 0,
      compliantControls: 0,
      nonCompliantControls: 0,
      frameworkAnalytics: []
    };
  }
  
  const data = result[0];
  
  const frameworkMap = new Map();
  data.frameworks.forEach((fw: any) => {
    if (!fw.name) return;
    if (!frameworkMap.has(fw.name)) {
      frameworkMap.set(fw.name, {
        frameworkName: fw.name,
        totalAssessments: 0,
        completedAssessments: 0,
        totalControls: 0,
        completedControls: 0,
        progressPercentage: 0
      });
    }
    const fwData = frameworkMap.get(fw.name);
    fwData.totalAssessments++;
    if (fw.status === "closed") fwData.completedAssessments++;
    fwData.totalControls += fw.totalControls;
    fwData.completedControls += fw.closedControls;
  });
  
  const frameworkAnalytics = Array.from(frameworkMap.values()).map(fw => ({
    ...fw,
    progressPercentage: fw.totalControls > 0 ? Math.round((fw.completedControls / fw.totalControls) * 100) : 0
  }));
  
  return {
    completedAssessments: data.completedAssessments,
    compliantControls: data.compliantControls,
    nonCompliantControls: data.nonCompliantControls,
    frameworkAnalytics
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
