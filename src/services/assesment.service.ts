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
  const framework = await (await import("../models/framework.model")).default.findById(payload.framework);
  if (!framework) throw new Error('Framework not found');
  if (!framework.complianceMetric) throw new Error('Framework compliance metric not configured');

  const assessmentData: any = {
    ...payload,
    status: AssesmentStatusEnum.drafted,
    complianceMetricValue: framework.complianceMetric.defaultValue
  };

  return await AssesmentModel.create(assessmentData);
};

const assignControls = async (
  assesmentId: string,
  controls: { controlId: string; departments: string[]; participants?: string[] }[],
  userName: string
) => {
  const draftEntry = await AssesmentModel.findOne({ assesmentId }).sort({ _id: 1 });
  if (!draftEntry) throw new Error('Assessment not found');

  const departmentService = (await import('./department.service')).default;
  const controlServiceModule = (await import('./control.service')).default;

  const insertedEntries = [];

  for (const item of controls) {    const control = await controlServiceModule.findById(item.controlId);
    if (!control) throw new Error(`Control not found: ${item.controlId}`);

    const departments = await departmentService.findByIds(item.departments);
    if (!departments || departments.length !== item.departments.length) {
      throw new Error(`Invalid department id(s) for control: ${item.controlId}`);
    }

    const existing = await AssesmentModel.findOne({ assesmentId, control: control._id });
    if (existing) continue;

    const entry = await AssesmentModel.create({
      assesmentId,
      name: draftEntry.name,
      description: draftEntry.description,
      frameworkType: draftEntry.frameworkType,
      framework: draftEntry.framework,
      frameworkName: draftEntry.frameworkName,
      control: control._id,
      controlId: control.controlCode,
      controlName: control.controlName,
      departments: departments.map((d: any) => ({ id: d._id, name: d.displayName })),
      participants: item.participants || [],
      attachments: [],
      status: AssesmentStatusEnum.open,
      complianceMetricValue: draftEntry.complianceMetricValue,
      startDate: draftEntry.startDate,
      dueDate: draftEntry.dueDate,
      createdBy: draftEntry.createdBy,
    });

    insertedEntries.push(entry);

    if (item.participants && item.participants.length > 0) {
      const emailService = (await import('./email.service')).default;
      emailService.sendAssessmentAssignmentEmail(item.participants, {
        name: draftEntry.name,
        description: draftEntry.description,
        controlName: control.controlName,
        dueDate: draftEntry.dueDate,
      }).catch((err: any) => console.error('Failed to send assignment emails:', err));
    }
  }

  return { assigned: insertedEntries.length, entries: insertedEntries };
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

  const skip = (page - 1) * limit;

  // Base match — no status filter here, we derive it after grouping
  const preMatch: any = {};
  if (frameworkType) preMatch.frameworkType = frameworkType;
  if (search) {
    preMatch.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { frameworkName: { $regex: search, $options: 'i' } },
    ];
  }
  if (dateFrom || dateTo) {
    preMatch.createdAt = {};
    if (dateFrom) preMatch.createdAt.$gte = new Date(dateFrom * 1000);
    if (dateTo) preMatch.createdAt.$lte = new Date(dateTo * 1000);
  }
  if (startDateFrom || startDateTo) {
    preMatch.startDate = {};
    if (startDateFrom) preMatch.startDate.$gte = startDateFrom;
    if (startDateTo) preMatch.startDate.$lte = startDateTo;
  }
  if (dueDateFrom || dueDateTo) {
    preMatch.dueDate = {};
    if (dueDateFrom) preMatch.dueDate.$gte = dueDateFrom;
    if (dueDateTo) preMatch.dueDate.$lte = dueDateTo;
  }

  const pipeline: any[] = [
    ...(Object.keys(preMatch).length ? [{ $match: preMatch }] : []),
    {
      $group: {
        _id: '$assesmentId',
        assessmentDocId: { $first: '$_id' },
        assesmentId: { $first: '$assesmentId' },
        name: { $first: '$name' },
        description: { $first: '$description' },
        frameworkType: { $first: '$frameworkType' },
        framework: { $first: '$framework' },
        frameworkName: { $first: '$frameworkName' },
        startDate: { $first: '$startDate' },
        dueDate: { $first: '$dueDate' },
        createdBy: { $first: '$createdBy' },
        createdAt: { $first: '$createdAt' },
        totalRecords: { $sum: 1 },
        totalControls: { $sum: { $cond: [{ $ne: ['$control', null] }, 1, 0] } },
        closedCount: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
        inProgressCount: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
      },
    },
    {
      // Derive status from grouped counts
      $addFields: {
        derivedStatus: {
          $switch: {
            branches: [
              // No controls assigned yet — single entry, no control records
              { case: { $eq: ['$totalControls', 0] }, then: 'drafted' },
              // All controls closed
              { case: { $eq: ['$closedCount', '$totalControls'] }, then: 'closed' },
              // Any control in_progress
              { case: { $gt: ['$inProgressCount', 0] }, then: 'in_progress' },
            ],
            default: 'open',
          },
        },
      },
    },
    // Apply status filter on derived status
    ...(status ? [{ $match: { derivedStatus: status } }] : []),
    { $sort: { createdAt: -1 } },
  ];

  const countPipeline = [...pipeline, { $count: 'total' }];
  const dataPipeline = [...pipeline, { $skip: skip }, { $limit: limit }];

  const [dataResult, countResult] = await Promise.all([
    AssesmentModel.aggregate(dataPipeline),
    AssesmentModel.aggregate(countPipeline),
  ]);

  return {
    data: dataResult.map(({ _id, closedCount, inProgressCount, totalRecords, ...rest }) => rest),
    pagination: {
      page,
      limit,
      total: countResult[0]?.total || 0,
      pages: Math.ceil((countResult[0]?.total || 0) / limit),
    },
  };
};

const getAssignedControls = async (assesmentId: string) => {
  return await AssesmentModel.find({ assesmentId, control: { $ne: null } })
    .select('_id control controlId controlName departments participants status complianceMetricValue')
    .lean();
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

const getAnalytics = async (filters: { startDate?: number; endDate?: number; domainCode?: string } = {}) => {
  const { startDate, endDate, domainCode } = filters;
  const FrameworkModel = (await import("../models/framework.model")).default;
  
  const matchStage: any = {};
  
  if (startDate) matchStage.startDate = { $gte: startDate };
  if (endDate) matchStage.dueDate = { $lte: endDate };

  if (domainCode) {
    const ControlModel = (await import("../models/control.model")).default;
    const controls = await ControlModel.find({ domainCode }).select('_id').lean();
    matchStage.control = { $in: controls.map(c => c._id) };
  }
  
  // Get all assessments with filters
  const assessments = await AssesmentModel.find(matchStage).lean();
  
  if (assessments.length === 0) {
    return {
      completedAssessments: 0,
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
        closedControls: 0
      });
    }
    const group = assessmentGroups.get(key);
    group.totalControls++;
    if (assessment.status === 'closed') group.closedControls++;
  });
  
  // Calculate overall stats
  let completedAssessments = 0;
  
  const frameworkMap = new Map();
  
  for (const [assesmentId, group] of assessmentGroups) {
    const isCompleted = group.closedControls === group.totalControls;
    if (isCompleted) completedAssessments++;
    
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
      frameworkId: fwData.frameworkId,
      frameworkName: fwData.frameworkName,
      totalApplicableControls: fwData.totalAssessments,
      metricType: complianceMetric?.type || null,
      metricLabel: complianceMetric?.label || null,
      distribution: Array.from(metricDistribution.values()),
    });
  }
  
  return {
    completedAssessments,
    frameworkAnalytics
  };
};

const getFrameworkSummaries = async (filters: { startDate?: number; endDate?: number; domainCode?: string } = {}) => {
  const { startDate, endDate, domainCode } = filters;
  const FrameworkModel = (await import("../models/framework.model")).default;

  const matchStage: any = {};
  if (startDate) matchStage.startDate = { $gte: startDate };
  if (endDate) matchStage.dueDate = { $lte: endDate };

  if (domainCode) {
    const ControlModel = (await import("../models/control.model")).default;
    const controls = await ControlModel.find({ domainCode }).select('_id').lean();
    matchStage.control = { $in: controls.map(c => c._id) };
  }

  const assessments = await AssesmentModel.find(matchStage).lean();

  if (assessments.length === 0) return [];

  // Get unique framework IDs and fetch their details
  const frameworkIds = Array.from(new Set(assessments.map(a => a.framework.toString())));
  const frameworks = await FrameworkModel.find({ _id: { $in: frameworkIds } }).lean();
  const frameworkMetricsMap = new Map(frameworks.map(fw => [fw._id.toString(), fw.complianceMetric]));

  // Group assessments by frameworkId
  const frameworkMap = new Map<string, { frameworkName: string; assessments: typeof assessments }>();
  assessments.forEach(a => {
    const fwId = a.framework.toString();
    if (!frameworkMap.has(fwId)) {
      frameworkMap.set(fwId, { frameworkName: a.frameworkName, assessments: [] });
    }
    frameworkMap.get(fwId)!.assessments.push(a);
  });

  const result = [];

  for (const [frameworkId, { frameworkName, assessments: fwAssessments }] of frameworkMap) {
    const complianceMetric = frameworkMetricsMap.get(frameworkId);

    const total = fwAssessments.length;
    const metricType = complianceMetric?.type || null;

    let summaryData: any;

    if (metricType === 'percentage') {
      const statusCounts = { open: 0, in_progress: 0, closed: 0 };
      fwAssessments.forEach(a => {
        if (a.status === 'open') statusCounts.open++;
        else if (a.status === 'in_progress') statusCounts.in_progress++;
        else if (a.status === 'closed') statusCounts.closed++;
      });

      summaryData = {
        completionPercentage: total > 0 ? Math.round((statusCounts.closed / total) * 100) : 0,
        distribution: [
          { status: 'open', count: statusCounts.open },
          { status: 'in_progress', count: statusCounts.in_progress },
          { status: 'closed', count: statusCounts.closed }
        ]
      };
    } else {
      // maturity_level: build metric value distribution and calculate average or dominant value
      const distributionMap = new Map<string, { value: string; label: string; count: number }>();
      if (complianceMetric?.values) {
        complianceMetric.values.forEach((v: any) => {
          distributionMap.set(v.value, { value: v.value, label: v.label, count: 0 });
        });
      }

      // weighted average: (ML1*nc1 + ML2*nc2 + ... MLn*ncn) / (nc1+nc2+...+ncn)
      // excludes value "0" and null from both numerator and denominator
      let weightedSum = 0;
      let eligibleCount = 0;
      const valueCounts = new Map<string, number>();

      fwAssessments.forEach(a => {
        const strVal = a.complianceMetricValue ? String(a.complianceMetricValue) : null;
        if (strVal) {
          valueCounts.set(strVal, (valueCounts.get(strVal) || 0) + 1);
          const dist = distributionMap.get(strVal);
          if (dist) dist.count++;
        }
        // exclude null and "0" from weighted average
        if (strVal && strVal !== '0') {
          const numVal = parseFloat(strVal);
          if (!isNaN(numVal)) {
            weightedSum += numVal;
            eligibleCount++;
          }
        }
      });

      let averageScore: number | null = null;
      let dominantValue: string | null = null;

      if (eligibleCount > 0) {
        averageScore = Math.round((weightedSum / eligibleCount) * 100) / 100;
      } else if (valueCounts.size > 0) {
        let maxCount = 0;
        valueCounts.forEach((count, val) => {
          if (count > maxCount) {
            maxCount = count;
            dominantValue = distributionMap.get(val)?.label || val;
          }
        });
      }

      summaryData = {
        averageScore,
        dominantValue,
        distribution: Array.from(distributionMap.values())
      };
    }

    result.push({
      frameworkId,
      frameworkName,
      metricType,
      metricLabel: complianceMetric?.label || null,
      totalApplicableControls: total,
      ...summaryData
    });
  }

  return result;
};

interface ByMetricFilters {
  frameworkId?: string;
  frameworkName?: string;
  metricValue: string;
  startDate?: number;
  endDate?: number;
  domainCode?: string;
  page?: number;
  limit?: number;
}

const findByMetric = async (filters: ByMetricFilters) => {
  const { frameworkId, frameworkName, metricValue, startDate, endDate, domainCode, page = 1, limit = 10 } = filters;
  const FrameworkModel = (await import("../models/framework.model")).default;
  const ControlModel = (await import("../models/control.model")).default;
  
  const query: any = {
    complianceMetricValue: String(metricValue)
  };
  
  if (frameworkId) {
    query.framework = frameworkId;
  } else if (frameworkName) {
    query.frameworkName = frameworkName;
  } else {
    throw new Error('Either frameworkId or frameworkName is required');
  }

  if (startDate) query.startDate = { $gte: startDate };
  if (endDate) query.dueDate = { $lte: endDate };

  if (domainCode) {
    const mongoose = (await import('mongoose')).default;
    const fwObjectId = frameworkId ? new mongoose.Types.ObjectId(frameworkId) : null;
    const controlQuery: any = { domainCode };
    if (fwObjectId) controlQuery.frameworkId = fwObjectId;
    const domainControls = await ControlModel.find(controlQuery).select('_id').lean();
    query.control = { $in: domainControls.map(c => c._id) };
  }

  const skip = (page - 1) * limit;

  const [rawData, total] = await Promise.all([
    AssesmentModel.find(query)
      .select('assesmentId name description frameworkName framework control controlId controlName status complianceMetricValue auditorNotes startDate dueDate createdAt updatedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    AssesmentModel.countDocuments(query)
  ]);

  // Populate control domain/subdomain fields
  const recordsWithControl = rawData.filter(a => a.control);
  const controlIds = [...new Set(recordsWithControl.map(a => a.control!.toString()))];
  const controls = controlIds.length > 0
    ? await ControlModel.find({ _id: { $in: controlIds } })
        .select('domainCode domainName subdomainCode subdomainName')
        .lean()
    : [];
  const controlMap = new Map(controls.map(c => [c._id.toString(), c]));

  const data = rawData.map(a => {
    const ctrl = a.control ? controlMap.get(a.control.toString()) : null;
    return {
      ...a,
      domainCode: ctrl?.domainCode || null,
      domainName: ctrl?.domainName || null,
      subdomainCode: ctrl?.subdomainCode || null,
      subdomainName: ctrl?.subdomainName || null,
    };
  });

  // Get framework details for metricInfo
  let metricInfo: any = null;
  if (data.length > 0) {
    const framework = await FrameworkModel.findById(data[0].framework).lean();
    if (framework?.complianceMetric) {
      const metricValueObj = framework.complianceMetric.values?.find((v: any) => v.value === metricValue);
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

const getFrameworkAnalytics = async (frameworkId: string, filters: { startDate?: number; endDate?: number; domainCode?: string } = {}) => {
  const { startDate, endDate, domainCode } = filters;
  const FrameworkModel = (await import("../models/framework.model")).default;
  const ControlModel = (await import("../models/control.model")).default;

  const mongoose = (await import('mongoose')).default;
  const frameworkObjectId = new mongoose.Types.ObjectId(frameworkId);

  const framework = await FrameworkModel.findById(frameworkObjectId).lean();
  if (!framework) throw new Error('Framework not found');

  const matchStage: any = { framework: frameworkObjectId };
  if (startDate) matchStage.startDate = { $gte: startDate };
  if (endDate) matchStage.dueDate = { $lte: endDate };

  if (domainCode) {
    const controls = await ControlModel.find({ frameworkId: frameworkObjectId, domainCode }).select('_id').lean();
    if (controls.length === 0) {
      // No controls found for this domain — return empty distribution
      const metricDistribution = framework.complianceMetric?.values?.map((v: any) => ({ value: v.value, label: v.label, count: 0 })) || [];
      const domainDocs = await ControlModel.find({ frameworkId: frameworkObjectId }).select('domainCode domainName').lean();
      const uniqueDomains = Array.from(new Map(domainDocs.map(d => [d.domainCode, { domainCode: d.domainCode, domainName: d.domainName }])).values());
      return {
        frameworkId,
        frameworkName: framework.displayName,
        metricType: framework.complianceMetric?.type || null,
        metricLabel: framework.complianceMetric?.label || null,
        totalApplicableControls: 0,
        distribution: metricDistribution,
        appliedDomainCode: domainCode,
        availableDomains: uniqueDomains,
      };
    }
    matchStage.control = { $in: controls.map(c => c._id) };
  }

  const assessments = await AssesmentModel.find(matchStage).lean();
  const complianceMetric = framework.complianceMetric;

  const metricDistribution = new Map();
  if (complianceMetric?.values) {
    complianceMetric.values.forEach((v: any) => {
      metricDistribution.set(v.value, { value: v.value, label: v.label, count: 0 });
    });
  }

  assessments.forEach(a => {
    if (a.complianceMetricValue) {
      const current = metricDistribution.get(String(a.complianceMetricValue));
      if (current) current.count++;
    }
  });

  let highestMetricCount = 0;
  if (complianceMetric?.values?.length) {
    const lastValue = complianceMetric.values[complianceMetric.values.length - 1];
    highestMetricCount = metricDistribution.get(lastValue.value)?.count || 0;
  }

  // Get distinct domain codes for this framework (for the filter dropdown)
  const domainDocs = await ControlModel.find({ frameworkId: frameworkObjectId })
    .select('domainCode domainName')
    .lean();
  const uniqueDomains = Array.from(
    new Map(domainDocs.map(d => [d.domainCode, { domainCode: d.domainCode, domainName: d.domainName }])).values()
  );

  return {
    frameworkId,
    frameworkName: framework.displayName,
    metricType: complianceMetric?.type || null,
    metricLabel: complianceMetric?.label || null,
    totalApplicableControls: assessments.length,
    distribution: Array.from(metricDistribution.values()),
    appliedDomainCode: domainCode || null,
    availableDomains: uniqueDomains,
  };
};

const importEvidence = async (targetAssessmentId: string | MongoIdType, sourceAssessmentId: string | MongoIdType, userName: string, userEmail: string) => {
  const { ApiError } = await import("../middleware/validate.request");

  const targetAssessment = await AssesmentModel.findById(targetAssessmentId);
  if (!targetAssessment) throw ApiError.notFound("Assessment not found");

  const sourceAssessment = await AssesmentModel.findById(sourceAssessmentId);
  if (!sourceAssessment) throw ApiError.notFound("Source assessment not found");

  if (targetAssessment.status === AssesmentStatusEnum.closed) {
    throw ApiError.badRequest("Cannot import evidence into a closed assessment");
  }

  if (!targetAssessment.control) {
    throw ApiError.badRequest("Cannot import evidence into a drafted assessment — assign a control first");
  }

  if (!sourceAssessment.control) {
    throw ApiError.badRequest("Source assessment has no control assigned");
  }

  // Allow if user is the creator OR a participant on the target assessment
  const isOwner = targetAssessment.createdBy === userName;
  const isParticipant = targetAssessment.participants.includes(userEmail);
  if (!isOwner && !isParticipant) {
    throw ApiError.forbidden("Only the assessment owner or an assigned participant can import evidence");
  }

  // Validate control match - allow if:
  // 1. Same control ObjectId
  // 2. Same assesmentId (common assessment group)
  // 3. Both controls belong to same common control
  const sameControl = targetAssessment.control.toString() === sourceAssessment.control.toString();
  const sameAssessmentGroup = targetAssessment.assesmentId === sourceAssessment.assesmentId;

  let belongToSameCommonControl = false;
  if (!sameControl && !sameAssessmentGroup) {
    const CommonControlModel = (await import("../models/common-control.model")).default;
    const sourceControlId = sourceAssessment.control.toString();
    const commonControlsWithTarget = await CommonControlModel.find({
      'mappedControls.controlId': targetAssessment.control
    }).lean();
    for (const cc of commonControlsWithTarget) {
      if (cc.mappedControls.some((mc: any) => mc.controlId?.toString() === sourceControlId)) {
        belongToSameCommonControl = true;
        break;
      }
    }
  }

  if (!sameControl && !sameAssessmentGroup && !belongToSameCommonControl) {
    throw ApiError.badRequest("Cannot import evidence: assessments have different controls");
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

const bulkClose = async (assesmentId: string, recordIds: string[]) => {
  // Validate all records belong to this assesmentId before touching anything
  const records = await AssesmentModel.find({ _id: { $in: recordIds } }).select('_id assesmentId control status').lean();

  for (const record of records) {
    if (record.assesmentId !== assesmentId) {
      throw new Error(`Record ${record._id} does not belong to this assessment`);
    }
    if (!record.control) {
      throw new Error(`Cannot close a draft header record: ${record._id}`);
    }
  }

  const results = [];
  let closed = 0;
  let skipped = 0;

  for (const record of records) {
    if (record.status === AssesmentStatusEnum.closed) {
      results.push({ recordId: record._id, status: 'skipped', reason: 'already closed' });
      skipped++;
    } else {
      await AssesmentModel.findByIdAndUpdate(record._id, { status: AssesmentStatusEnum.closed });
      results.push({ recordId: record._id, status: 'closed' });
      closed++;
    }
  }

  return { message: 'Bulk close completed', closed, skipped, results };
};

const updateAssignedControl = async (
  assessmentRecordId: string,
  data: { departments?: string[]; participants?: string[] }
) => {
  const departmentService = (await import('./department.service')).default;

  const record = await AssesmentModel.findById(assessmentRecordId);
  if (!record) throw new Error('Assessment control record not found');
  if (!record.control) throw new Error('Cannot update a draft record');
  if (record.status === AssesmentStatusEnum.closed) throw new Error('Cannot update a closed assessment control');

  const updateData: any = {};

  if (data.departments !== undefined) {
    const departments = await departmentService.findByIds(data.departments);
    if (departments.length !== data.departments.length) throw new Error('Invalid department id(s)');
    updateData.departments = departments.map((d: any) => ({ id: d._id, name: d.displayName }));
  }

  if (data.participants !== undefined) {
    updateData.participants = data.participants;
  }

  const updated = await AssesmentModel.findByIdAndUpdate(assessmentRecordId, updateData, { new: true })
    .select('_id control controlId controlName departments participants status complianceMetricValue');

  // Send email to any newly added participants
  if (data.participants && data.participants.length > 0) {
    const newParticipants = data.participants.filter(p => !record.participants.includes(p));
    if (newParticipants.length > 0) {
      const emailService = (await import('./email.service')).default;
      emailService.sendAssessmentAssignmentEmail(newParticipants, {
        name: record.name,
        description: record.description,
        controlName: record.controlName ?? '',
        dueDate: record.dueDate,
      }).catch((err: any) => console.error('Failed to send assignment emails:', err));
    }
  }

  return updated;
};

const getMyControls = async (email: string, filters: { status?: string; page?: number; limit?: number } = {}) => {
  const { status, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const query: any = {
    participants: email,
    control: { $ne: null },
  };

  if (status) {
    query.status = status;
  } else {
    // default: exclude closed so the list stays actionable
    query.status = { $ne: AssesmentStatusEnum.closed };
  }

  const [data, total] = await Promise.all([
    AssesmentModel.find(query)
      .select('_id assesmentId name frameworkName controlId controlName departments status dueDate startDate aiResult')
      .sort({ dueDate: 1 }) // soonest due first
      .skip(skip)
      .limit(limit)
      .lean(),
    AssesmentModel.countDocuments(query),
  ]);

  return {
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export default {
  findById,
  create,
  assignControls,
  updateAssignedControl,
  getAssignedControls,
  getMyControls,
  update,
  dashboardList,
  findRecentByControlId,
  findRecentByMultipleControlIds,
  getAnalytics,
  getFrameworkSummaries,
  getFrameworkAnalytics,
  findByMetric,
  importEvidence,
  bulkClose,
};
