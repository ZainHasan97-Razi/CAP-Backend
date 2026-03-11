import AssesmentModel, {
  CreateAssesmentDto,
  UpdateAssesmentDto,
  AssesmentStatusEnum,
} from "../models/assesment.model";
import { MongoIdType } from "types/mongoid.type";
import assesmentCommentService from "./assesment-comment.service";
import systemLogService from "./system-log.service";
import commonControlService from "./common-control.service";

interface DashboardFilters {
  status?: string;
  frameworkType?: string;
  department?: string;
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

const create = async (payload: CreateAssesmentDto, userId: string, userName: string) => {
  // Get framework to set complianceMetricValue
  const framework = await (await import("../models/framework.model")).default.findById(payload.framework);
  if (!framework) {
    throw new Error('Framework not found');
  }
  if (!framework.complianceMetric) {
    throw new Error('Framework compliance metric not configured');
  }
  
  // Set default complianceMetricValue from framework
  const assessmentData: any = { 
    ...payload,
    complianceMetricValue: framework.complianceMetric.defaultValue
  };
  
  const assessment = await AssesmentModel.create(assessmentData);
  return assessment;
};

const update = async (id: string | MongoIdType, data: UpdateAssesmentDto) => {
  // Validate complianceMetricValue if provided
  if (data.complianceMetricValue !== undefined) {
    const assessment = await AssesmentModel.findById(id);
    if (!assessment) {
      throw new Error('Assessment not found');
    }
    
    const FrameworkModel = (await import("../models/framework.model")).default;
    const framework = await FrameworkModel.findById(assessment.framework);
    
    if (framework?.complianceMetric?.values && framework.complianceMetric.values.length > 0) {
      const validValue = framework.complianceMetric.values.some(v => v.value === data.complianceMetricValue);
      if (!validValue) {
        throw new Error('Invalid complianceMetricValue for this framework');
      }
    }
  }
  
  return await AssesmentModel.findByIdAndUpdate(id, data, { new: true });
};

const dashboardList = async (filters: DashboardFilters = {}) => {
  const {
    status,
    frameworkType,
    department,
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
      "name description frameworkName controlId controlName updatedAt status attachments",
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
      "name description frameworkName controlId controlName updatedAt status attachments",
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

const importEvidence = async (targetAssessmentId: string | MongoIdType, sourceAssessmentId: string | MongoIdType, userName: string) => {
  const targetAssessment = await AssesmentModel.findById(targetAssessmentId);
  if (!targetAssessment) {
    throw new Error("Assessment not found");
  }

  const sourceAssessment = await AssesmentModel.findById(sourceAssessmentId);
  if (!sourceAssessment) {
    throw new Error("Source assessment not found");
  }

  // Validate status
  if (targetAssessment.status === AssesmentStatusEnum.closed || targetAssessment.status === AssesmentStatusEnum.discard) {
    throw new Error("Cannot import evidence: assessment is closed or discarded");
  }

  // Validate control match - allow if:
  // 1. Same control ObjectId
  // 2. Same assesmentId (common assessment group)  
  // 3. Both controls belong to same common control
  const sameControl = targetAssessment.control.toString() === sourceAssessment.control.toString();
  const sameAssessmentGroup = targetAssessment.assesmentId === sourceAssessment.assesmentId;
  
  let belongToSameCommonControl = false;
  if (!sameControl && !sameAssessmentGroup) {
    // Check if both controls belong to same common control by querying directly
    const CommonControlModel = (await import("../models/common-control.model")).default;
    const targetControlId = targetAssessment.control.toString();
    const sourceControlId = sourceAssessment.control.toString();
    
    // Find common controls that contain the target control
    const commonControlsWithTarget = await CommonControlModel.find({
      'mappedControls.controlId': targetAssessment.control
    }).lean();
    
    // Check if any of these common controls also contain the source control
    for (const cc of commonControlsWithTarget) {
      const hasSourceControl = cc.mappedControls.some(
        (mc: any) => mc.controlId && mc.controlId.toString() === sourceControlId
      );
      
      if (hasSourceControl) {
        belongToSameCommonControl = true;
        break;
      }
    }
  }
  
  if (!sameControl && !sameAssessmentGroup && !belongToSameCommonControl) {
    throw new Error("Cannot import evidence: assessments have different controls");
  }

  // Validate ownership
  if (targetAssessment.createdBy !== userName) {
    throw new Error("Only assessment owner can import evidence");
  }

  // Delete previously imported comments if re-importing
  let replacedComments = 0;
  if (targetAssessment.commonAssessmentId) {
    const deleteResult = await assesmentCommentService.deleteImportedComments(
      targetAssessmentId as string,
      targetAssessment.commonAssessmentId as any
    );
    replacedComments = deleteResult.deletedCount || 0;
  }

  // Copy comments from source
  const copiedComments = await assesmentCommentService.copyCommentsFromAssessment(
    sourceAssessmentId as string,
    targetAssessmentId as string,
    userName,
    userName,
    sourceAssessmentId as any
  );

  // Merge attachments (no duplicates)
  const existingAttachments = targetAssessment.attachments || [];
  const sourceAttachments = sourceAssessment.attachments || [];
  const mergedAttachments = [...new Set([...existingAttachments, ...sourceAttachments])];

  // Update assessment
  targetAssessment.commonAssessmentId = sourceAssessment._id as any;
  targetAssessment.attachments = mergedAttachments;
  if (targetAssessment.status === AssesmentStatusEnum.open) {
    targetAssessment.status = AssesmentStatusEnum.in_progress;
  }

  await targetAssessment.save();

  return {
    message: "Evidence imported successfully",
    assessment: targetAssessment,
    importedItems: {
      comments: copiedComments.length,
      attachments: sourceAttachments.length,
      replacedComments
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
  importEvidence,
};
