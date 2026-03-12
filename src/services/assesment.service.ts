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
  const FrameworkModel = (await import("../models/framework.model")).default;
  
  const matchStage: any = {};
  
  if (startDate) {
    matchStage.startDate = { $gte: startDate };
  }
  if (endDate) {
    matchStage.dueDate = { $lte: endDate };
  }
  
  // Get all assessments with filters
  const assessments = await AssesmentModel.find(matchStage).lean();
  
  if (assessments.length === 0) {
    return {
      completedAssessments: 0,
      compliantControls: 0,
      nonCompliantControls: 0,
      frameworkAnalytics: []
    };
  }
  
  // Group by assesmentId to calculate assessment-level status
  const assessmentGroups = new Map();
  assessments.forEach(assessment => {
    const key = assessment.assesmentId;
    if (!assessmentGroups.has(key)) {
      assessmentGroups.set(key, {
        frameworkName: assessment.frameworkName,
        frameworkId: assessment.framework,
        totalControls: 0,
        closedControls: 0,
        inProgressControls: 0
      });
    }
    const group = assessmentGroups.get(key);
    group.totalControls++;
    if (assessment.status === 'closed') group.closedControls++;
    if (assessment.status === 'in_progress') group.inProgressControls++;
  });
  
  // Calculate overall stats
  let completedAssessments = 0;
  let compliantControls = 0;
  let nonCompliantControls = 0;
  
  const frameworkMap = new Map();
  
  for (const [assesmentId, group] of assessmentGroups) {
    const isCompleted = group.closedControls === group.totalControls;
    if (isCompleted) completedAssessments++;
    
    if (!isCompleted) {
      compliantControls += group.closedControls;
      nonCompliantControls += group.inProgressControls;
    }
    
    // Aggregate by framework
    if (!frameworkMap.has(group.frameworkName)) {
      frameworkMap.set(group.frameworkName, {
        frameworkName: group.frameworkName,
        frameworkId: group.frameworkId,
        totalAssessments: 0,
        completedAssessments: 0,
        totalControls: 0,
        completedControls: 0,
        progressPercentage: 0
      });
    }
    const fwData = frameworkMap.get(group.frameworkName);
    fwData.totalAssessments++;
    if (isCompleted) fwData.completedAssessments++;
    fwData.totalControls += group.totalControls;
    fwData.completedControls += group.closedControls;
  }
  
  // Get frameworks with their compliance metrics
  const frameworkIds = Array.from(new Set(assessments.map(a => a.framework.toString())));
  const frameworks = await FrameworkModel.find({ _id: { $in: frameworkIds } }).lean();
  const frameworkMetricsMap = new Map();
  frameworks.forEach(fw => {
    frameworkMetricsMap.set(fw._id.toString(), fw.complianceMetric);
  });
  
  // Calculate metric distribution per framework
  const frameworkAnalytics = [];
  
  for (const [frameworkName, fwData] of frameworkMap) {
    const frameworkId = fwData.frameworkId.toString();
    const complianceMetric = frameworkMetricsMap.get(frameworkId);
    
    // Get all assessments for this framework
    const frameworkAssessments = assessments.filter(
      a => a.framework.toString() === frameworkId
    );
    
    // Calculate metric distribution
    const metricDistribution = new Map();
    let highestMetricValue = null;
    let highestMetricCount = 0;
    
    if (complianceMetric && complianceMetric.values) {
      // Initialize distribution with all possible values
      complianceMetric.values.forEach((v: any) => {
        metricDistribution.set(v.value, {
          value: v.value,
          label: v.label,
          count: 0
        });
      });
      
      // Count assessments by metric value
      frameworkAssessments.forEach(assessment => {
        if (assessment.complianceMetricValue) {
          const metricValue = String(assessment.complianceMetricValue);
          const current = metricDistribution.get(metricValue);
          if (current) {
            current.count++;
          }
        }
      });
      
      // Find highest metric value (last in values array) and its count
      if (complianceMetric.values.length > 0) {
        const lastValue = complianceMetric.values[complianceMetric.values.length - 1];
        highestMetricValue = lastValue.value;
        const highestMetric = metricDistribution.get(highestMetricValue);
        if (highestMetric) {
          highestMetricCount = highestMetric.count;
        }
      }
    }
    
    frameworkAnalytics.push({
      frameworkName: fwData.frameworkName,
      totalAssessments: fwData.totalAssessments,
      completedAssessments: fwData.completedAssessments,
      totalControls: fwData.totalControls,
      completedControls: fwData.completedControls,
      progressPercentage: fwData.totalControls > 0 
        ? Math.round((fwData.completedControls / fwData.totalControls) * 100) 
        : 0,
      metricType: complianceMetric?.type || null,
      metricLabel: complianceMetric?.label || null,
      distribution: Array.from(metricDistribution.values()),
      compliantCount: highestMetricCount
    });
  }
  
  return {
    completedAssessments,
    compliantControls,
    nonCompliantControls,
    frameworkAnalytics
  };
};

interface ByMetricFilters {
  frameworkId?: string;
  frameworkName?: string;
  metricValue: string;
  startDate?: number;
  endDate?: number;
  page?: number;
  limit?: number;
}

const findByMetric = async (filters: ByMetricFilters) => {
  const { frameworkId, frameworkName, metricValue, startDate, endDate, page = 1, limit = 10 } = filters;
  const FrameworkModel = (await import("../models/framework.model")).default;
  
  // Build query - NO DATE FILTERS (analytics doesn't use them for distribution)
  const query: any = {
    complianceMetricValue: String(metricValue)
  };
  
  // Filter by framework
  if (frameworkId) {
    query.framework = frameworkId;
  } else if (frameworkName) {
    query.frameworkName = frameworkName;
  } else {
    throw new Error('Either frameworkId or frameworkName is required');
  }
  
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    AssesmentModel.find(query)
      .select('assesmentId name description frameworkName framework controlId controlName status complianceMetricValue startDate dueDate createdAt updatedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    AssesmentModel.countDocuments(query)
  ]);
  
  // Get framework details for metricInfo
  let metricInfo: any = null;
  if (data.length > 0) {
    const framework = await FrameworkModel.findById(data[0].framework).lean();
    if (framework && framework.complianceMetric) {
      const metricValueObj = framework.complianceMetric.values.find((v: any) => v.value === metricValue);
      metricInfo = {
        frameworkName: framework.displayName,
        frameworkId: framework._id,
        metricType: framework.complianceMetric.type,
        metricLabel: framework.complianceMetric.label,
        metricValue: metricValue,
        metricValueLabel: metricValueObj?.label || metricValue
      };
    }
  }
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    metricInfo
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
  findByMetric,
  importEvidence,
};
