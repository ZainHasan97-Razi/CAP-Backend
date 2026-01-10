import { ARequest } from "types/auth.request.type";
import { NextFunction, Response } from 'express';
import framewaorkService from "../services/framewaork.service";
import controlService from "../services/control.service";
import { ApiError } from "../middleware/validate.request";
import csv from 'csv-parser';
import { Readable } from 'stream';

export const create = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const framework = await framewaorkService.create(req.body)

    res.json(framework);
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}

export const update = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const framework = await framewaorkService.update(id, req.body)
    if (!framework) {
      // return res.status(401).json({ error: 'Invalid framwork id' });
      throw ApiError.badRequest("Invalid framwork id");
    }

    res.json(framework);
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}

export const findAllActive = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query;
    const frameworks = await framewaorkService.findAllActive(type as string)

    res.json(frameworks);
  } catch (error) {
    console.error(error);
    next(error); // pass to global handler
  }
}

export const uploadCsv = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const { displayName, type } = req.body;
    const file = req.file;

    if (!file) {
      throw ApiError.badRequest("CSV file is required");
    }

    if (!displayName || !type) {
      throw ApiError.badRequest("Framework displayName and type are required");
    }

    // Validate file type
    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw ApiError.badRequest("Only CSV files are allowed");
    }

    const result = await framewaorkService.createFromCsv(displayName, type, file.buffer);
    res.json(result);
  } catch (error: any) {
    console.error('CSV Upload Error:', error.message);
    if (error.message.includes('Missing required columns') || 
        error.message.includes('CSV validation errors') ||
        error.message.includes('No valid controls found')) {
      next(ApiError.badRequest(error.message));
    } else {
      next(error);
    }
  }
}