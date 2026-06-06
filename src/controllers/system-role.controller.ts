import { ARequest } from 'types/auth.request.type';
import { NextFunction, Response } from 'express';
import SystemRoleModel, { DEFAULT_ROLE_PERMISSIONS, PERMISSION_META, ROLE_META, SystemRoleEnum } from '../models/system-role.model';
import { ApiError } from '../middleware/validate.request';
import { IUser } from 'types/req.user.type';
import UserModel from '../models/user.model';

export const ensureSystemRolesSeeded = async () => {
  const ops = Object.entries(DEFAULT_ROLE_PERMISSIONS).map(([role, permissions]) => ({
    updateOne: {
      filter: { role },
      update: {
        $set: { permissions },
        $setOnInsert: { role },
      },
      upsert: true,
    },
  }));
  await SystemRoleModel.bulkWrite(ops);
  console.log('[SystemRoles] Seeded/verified system roles');
};

export const getAllSystemRoles = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const roles = await SystemRoleModel.find().lean();

    // Count users per system role in one query
    const userCounts = await UserModel.aggregate([
      { $unwind: '$systemRoles' },
      { $group: { _id: '$systemRoles', count: { $sum: 1 } } },
    ]);
    const userCountMap: Record<string, number> = {};
    userCounts.forEach(({ _id, count }) => { userCountMap[_id] = count; });

    const enriched = roles.map((r) => ({
      ...r,
      label: ROLE_META[r.role as keyof typeof ROLE_META]?.label ?? r.role,
      description: ROLE_META[r.role as keyof typeof ROLE_META]?.description ?? '',
      userCount: userCountMap[r.role] ?? 0,
      permissionCount: r.permissions.length,
    }));

    res.json(enriched);
  } catch (error) {
    next(error);
  }
};

export const getPermissions = (_req: ARequest, res: Response) => {
  const view: any[] = [];
  const action: any[] = [];

  Object.entries(PERMISSION_META).forEach(([key, meta]) => {
    const entry = { key, label: meta.label, description: meta.description };
    if (meta.type === 'view') view.push(entry);
    else action.push(entry);
  });

  res.json({ view, action });
};

export const updateRolePermissions = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    if (!user.systemRoles?.includes(SystemRoleEnum.super_admin)) {
      throw ApiError.forbidden('Only super admins can update role permissions');
    }

    const { role } = req.params;
    const { permissions } = req.body;

    const updated = await SystemRoleModel.findOneAndUpdate(
      { role },
      { permissions },
      { new: true }
    );
    if (!updated) throw ApiError.notFound('System role not found');

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const seedSystemRoles = async (req: ARequest, res: Response, next: NextFunction) => {
  try {
    await ensureSystemRolesSeeded();
    const roles = await SystemRoleModel.find().lean();
    res.json({ message: 'System roles seeded successfully', roles });
  } catch (error) {
    next(error);
  }
};
