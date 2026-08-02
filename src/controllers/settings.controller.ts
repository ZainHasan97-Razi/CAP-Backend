import { Response, NextFunction } from 'express';
import { ARequest } from 'types/auth.request.type';
import { IUser } from 'types/req.user.type';
import { ApiError } from '../middleware/validate.request';
import SettingsModel from '../models/settings.model';

const getOrCreateSettings = async () => {
  let settings = await SettingsModel.findOne();
  if (!settings) settings = await SettingsModel.create({});
  return settings;
};

export const getSettings = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ aiEnabled: settings.aiEnabled });
  } catch (error) {
    next(error);
  }
};

export const toggleAi = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    if (!user.systemRoles?.includes('super_admin')) {
      throw ApiError.forbidden('Only super_admin can change AI settings');
    }

    const { aiEnabled } = req.body;
    if (typeof aiEnabled !== 'boolean') {
      throw ApiError.badRequest('aiEnabled must be a boolean');
    }

    const settings = await getOrCreateSettings();
    settings.aiEnabled = aiEnabled;
    await settings.save();

    res.json({ message: `AI feature ${aiEnabled ? 'enabled' : 'disabled'}`, aiEnabled });
  } catch (error) {
    next(error);
  }
};
