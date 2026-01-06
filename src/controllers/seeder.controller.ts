import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import seederService from "../services/seeder.service";
import { ApiError } from "../middleware/validate.request";

export const seedAll = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const results = await seederService.seedAll();
    res.json({
      success: true,
      message: 'All frameworks seeded successfully',
      data: results
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const seedFramework = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { frameworkName } = req.params;
    
    if (!frameworkName) {
      throw ApiError.badRequest("Framework name is required");
    }

    const result = await seederService.seedFramework(frameworkName);
    res.json({
      success: true,
      message: `${frameworkName} framework seeded successfully`,
      data: result
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const removeAll = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    await seederService.removeAll();
    res.json({
      success: true,
      message: 'All frameworks removed successfully'
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const removeFramework = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { frameworkName } = req.params;
    
    if (!frameworkName) {
      throw ApiError.badRequest("Framework name is required");
    }

    await seederService.removeFramework(frameworkName);
    res.json({
      success: true,
      message: `${frameworkName} framework removed successfully`
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const resetAll = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const results = await seederService.resetAll();
    res.json({
      success: true,
      message: 'All frameworks reset successfully',
      data: results
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const resetFramework = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { frameworkName } = req.params;
    
    if (!frameworkName) {
      throw ApiError.badRequest("Framework name is required");
    }

    const result = await seederService.resetFramework(frameworkName);
    res.json({
      success: true,
      message: `${frameworkName} framework reset successfully`,
      data: result
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAvailableFrameworks = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const frameworks = seederService.getAvailableFrameworks();
    res.json({
      success: true,
      data: frameworks
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};