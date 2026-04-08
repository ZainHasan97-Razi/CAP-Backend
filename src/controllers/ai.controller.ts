import { Request, Response, NextFunction } from 'express';
import FrameworkModel from '../models/framework.model';
import ControlModel from '../models/control.model';
import AssesmentModel from '../models/assesment.model';
import { ApiError } from '../middleware/validate.request';

// GET /api/ai/frameworks
export const listFrameworks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const frameworks = await FrameworkModel.find({ status: 'active' })
      .select('_id displayId displayName type complianceMetric')
      .lean();
    res.json(frameworks);
  } catch (error) {
    next(error);
  }
};

// GET /api/ai/frameworks/:frameworkId/controls
export const listControlsByFramework = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { frameworkId } = req.params;
    const controls = await ControlModel.find({ frameworkId, status: 'active' })
      .select('_id controlCode controlName domainCode domainName subdomainCode subdomainName description properties')
      .lean();
    res.json(controls);
  } catch (error) {
    next(error);
  }
};

// GET /api/ai/controls/:controlCode
export const getControlDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { controlCode } = req.params;
    const control = await ControlModel.findOne({ controlCode }).lean();
    if (!control) throw ApiError.notFound('Control not found');
    res.json(control);
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/webhook/result
export const receiveAiResult = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assessmentId, result } = req.body;
    if (!assessmentId || result === undefined) {
      throw ApiError.badRequest('assessmentId and result are required');
    }

    const updated = await AssesmentModel.findByIdAndUpdate(
      assessmentId,
      { aiResult: result },
      { new: true }
    );
    if (!updated) throw ApiError.notFound('Assessment not found');

    res.json({ message: 'AI result saved successfully' });
  } catch (error) {
    next(error);
  }
};
