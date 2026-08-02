import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import assesmentService from "../services/assesment.service";
import { ApiError } from "../middleware/validate.request";
import { CreateAssesmentDto, AssesmentStatusEnumType } from "../models/assesment.model";
import framewaorkService from "../services/framewaork.service";
import { IUser } from "types/req.user.type";
import userActivityService from "../services/user-activity.service";

const getIp = (req: any) =>
  (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
  req.socket?.remoteAddress || 'unknown';

type UpdateRequestDto = {
  attachments?: string[];
  description?: string;
  status?: AssesmentStatusEnumType;
  complianceMetricValue?: string;
  auditorNotes?: string;
}

type CreateRequestDto = {
  assesmentId: string;
  name: string;
  description: string;
  framework: string;
  startDate: number;
  dueDate: number;
}

type AssignControlsRequestDto = {
  controls: {
    controlId: string;
    departments: string[];
    participants?: string[];
  }[];
}

export const create = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const body = req.body as CreateRequestDto;
    const framework = await framewaorkService.findById(body.framework);
    if (!framework) {
      throw ApiError.badRequest("Invalid framework id");
    }

    const payload: CreateAssesmentDto = {
      assesmentId: body.assesmentId,
      name: body.name,
      description: body.description,
      frameworkType: framework.type,
      framework: framework._id,
      frameworkName: framework.displayName,
      control: null as any,
      controlId: null as any,
      controlName: null as any,
      departments: [],
      participants: [],
      attachments: [],
      startDate: body.startDate,
      dueDate: body.dueDate,
      createdBy: (req.user as IUser).userName,
    };

    const assesment = await assesmentService.create(
      payload,
      (req.user as IUser).userName,
      (req.user as IUser).userName
    );

    res.json({ message: 'Request success', assesment });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const getAssignedControls = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { assesmentId } = req.params;
    const result = await assesmentService.getAssignedControls(assesmentId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export const getMyControls = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    const filters = {
      status: req.query.status as string | undefined,
      page:   req.query.page  ? parseInt(req.query.page  as string) : 1,
      limit:  req.query.limit ? parseInt(req.query.limit as string) : 10,
    };

    const result = await assesmentService.getMyControls(user.email, filters);
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const updateAssignedControl = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { assessmentRecordId } = req.params;
    const { departments, participants } = req.body;

    const updated = await assesmentService.updateAssignedControl(assessmentRecordId, { departments, participants });
    res.json(updated);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const assignControls = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { assesmentId } = req.params;
    const body = req.body as AssignControlsRequestDto;
    const user = req.user as IUser;

    const result = await assesmentService.assignControls(assesmentId, body.controls, user.userName);
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const update = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const body = req.body as UpdateRequestDto;
    const user = req.user as IUser;

    const existing = await assesmentService.findById(id);
    if (!existing) throw ApiError.notFound('Assessment not found');

    // Immutable archive: closed assessments cannot be modified
    if (existing.status === 'closed') {
      throw ApiError.forbidden('Closed assessments are immutable and cannot be modified');
    }

    // Only compliance_manager can close an assessment
    if (body.status === 'closed' && !user.systemRoles?.includes('compliance_manager')) {
      throw ApiError.forbidden('Only compliance managers can close assessments');
    }

    const assesment = await assesmentService.update(id, body as any);
    if (!assesment) throw ApiError.notFound('Assessment not found');

    // Assessment lifecycle log on status change
    if (body.status && body.status !== existing.status) {
      userActivityService.auditLog({
        userId: user._id, userName: user.userName, email: user.email,
        sessionId: user.sessionId, ipAddress: getIp(req),
        eventType: 'ASSESSMENT', eventSubtype: 'STATUS_CHANGE',
        resourceType: 'ASSESSMENT', resourceId: id,
        action: 'UPDATE', result: 'SUCCESS',
        beforeValue: { status: existing.status },
        afterValue:  { status: body.status },
        apiUrl: req.originalUrl, method: req.method,
      }).catch(() => {});
    }

    res.json(assesment);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const findById = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const assesment = await assesmentService.findById(id);
    if (!assesment) {
      throw ApiError.notFound("Assesment not found");
    }

    res.json(assesment);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const dashboardList = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const filters = {
      status: req.query.status as string,
      frameworkType: req.query.frameworkType as string,
      search: req.query.search as string,
      dateFrom: req.query.dateFrom ? parseInt(req.query.dateFrom as string) : undefined,
      dateTo: req.query.dateTo ? parseInt(req.query.dateTo as string) : undefined,
      startDateFrom: req.query.startDateFrom ? parseInt(req.query.startDateFrom as string) : undefined,
      startDateTo: req.query.startDateTo ? parseInt(req.query.startDateTo as string) : undefined,
      dueDateFrom: req.query.dueDateFrom ? parseInt(req.query.dueDateFrom as string) : undefined,
      dueDateTo: req.query.dueDateTo ? parseInt(req.query.dueDateTo as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10
    };

    const result = await assesmentService.dashboardList(filters);
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const getAnalytics = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const filters = {
      startDate: req.query.startDate ? parseInt(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? parseInt(req.query.endDate as string) : undefined,
      domainCode: req.query.domainCode as string | undefined,
    };

    const analytics = await assesmentService.getAnalytics(filters);
    res.json(analytics);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const getFrameworkSummaries = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const filters = {
      startDate: req.query.startDate ? parseInt(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? parseInt(req.query.endDate as string) : undefined,
      domainCode: req.query.domainCode as string | undefined,
    };
    const result = await assesmentService.getFrameworkSummaries(filters);
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const getByMetric = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const filters = {
      frameworkId: req.query.frameworkId as string,
      frameworkName: req.query.frameworkName as string,
      metricValue: req.query.metricValue as string,
      domainCode: req.query.domainCode as string | undefined,
      startDate: req.query.startDate ? parseInt(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? parseInt(req.query.endDate as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10
    };

    const result = await assesmentService.findByMetric(filters);
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const getFrameworkAnalytics = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { frameworkId } = req.params;
    const filters = {
      startDate: req.query.startDate ? parseInt(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? parseInt(req.query.endDate as string) : undefined,
      domainCode: req.query.domainCode as string | undefined,
    };
    const result = await assesmentService.getFrameworkAnalytics(frameworkId, filters);
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const importEvidence = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { sourceAssessmentId } = req.body;
    const user = req.user as IUser;

    const result = await assesmentService.importEvidence(id, sourceAssessmentId, user.userName, user.email);
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const bulkClose = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { assesmentId } = req.params;
    const { recordIds } = req.body;
    const user = req.user as IUser;

    if (!user.systemRoles?.includes('compliance_manager')) {
      throw ApiError.forbidden('Only compliance managers can bulk close controls');
    }

    const result = await assesmentService.bulkClose(assesmentId, recordIds);

    userActivityService.auditLog({
      userId: user._id, userName: user.userName, email: user.email,
      sessionId: user.sessionId, ipAddress: getIp(req),
      eventType: 'ASSESSMENT', eventSubtype: 'BULK_CLOSE',
      resourceType: 'ASSESSMENT', resourceId: assesmentId,
      action: 'UPDATE', result: 'SUCCESS',
      afterValue: { closed: result.closed, skipped: result.skipped, recordIds },
      apiUrl: req.originalUrl, method: req.method,
    }).catch(() => {});

    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const requestReview = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user as IUser;

    if (!user.systemRoles?.includes('compliance_manager')) {
      throw ApiError.forbidden('Only compliance managers can request reviewer sign-off');
    }

    const assessment = await assesmentService.requestReview(id, user.userName);

    userActivityService.auditLog({
      userId: user._id, userName: user.userName, email: user.email,
      sessionId: user.sessionId, ipAddress: getIp(req),
      eventType: 'ASSESSMENT', eventSubtype: 'REVIEW_REQUESTED',
      resourceType: 'ASSESSMENT', resourceId: id,
      action: 'UPDATE', result: 'SUCCESS',
      apiUrl: req.originalUrl, method: req.method,
    }).catch(() => {});

    res.json({ message: 'Review requested', assessment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const reviewerSignoff = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user as IUser;

    if (!user.systemRoles?.includes('assessment_reviewer')) {
      throw ApiError.forbidden('Only assessment reviewers can sign off on assessments');
    }

    const assessment = await assesmentService.reviewerSignoff(id, user.userName);

    userActivityService.auditLog({
      userId: user._id, userName: user.userName, email: user.email,
      sessionId: user.sessionId, ipAddress: getIp(req),
      eventType: 'ASSESSMENT', eventSubtype: 'REVIEWER_SIGNOFF',
      resourceType: 'ASSESSMENT', resourceId: id,
      action: 'UPDATE', result: 'SUCCESS',
      apiUrl: req.originalUrl, method: req.method,
    }).catch(() => {});

    res.json({ message: 'Assessment approved by reviewer', assessment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const triggerAiAnalysis = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const assessment = await assesmentService.findById(id);
    if (!assessment) throw ApiError.notFound('Assessment not found');

    const aiServiceUrl = process.env.AI_SERVICE_URL;
    if (!aiServiceUrl) throw ApiError.internalServer('AI service URL not configured');

    fetch(`${aiServiceUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessmentId: assessment._id, assessment }),
    }).catch(err => console.error('[AI Trigger] Failed to reach AI service:', err));

    res.json({ message: 'AI analysis triggered. Result will be delivered via webhook.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
