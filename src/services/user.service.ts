import UserModel, { CreateUserDto } from "../models/user.model";
import { MongoIdType } from "types/mongoid.type";

interface UserListFilters {
  search?: string;
  page?: number;
  limit?: number;
}

const findByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};

const findById = async (id: string|MongoIdType) => {
  return await UserModel.findById(id);
};

const createUser = async (user: CreateUserDto) => {
  return await UserModel.create(user);
};

const list = async (filters: UserListFilters = {}) => {
  const { search, page = 1, limit = 10 } = filters;
  
  const query: any = {};
  
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    UserModel.find(query)
      .select('-password')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    UserModel.countDocuments(query)
  ]);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

const findByDepartments = async (departmentIds: (string | MongoIdType)[]) => {
  return await UserModel.find({ 
    departmentId: { $in: departmentIds },
    status: 'active'
  })
  .select('userName email department departmentId')
  .lean();
};

const updateSystemRoles = async (id: string, systemRoles: string[]) => {
  return await UserModel.findByIdAndUpdate(id, { systemRoles }, { new: true }).select('-password');
};

const updatePassword = async (id: string, newPassword: string) => {
  const bcrypt = require('bcryptjs');
  const user = await UserModel.findById(id);
  if (!user) throw new Error('User not found');

  // Check last 12 passwords for reuse
  const history = user.passwordHistory ?? [];
  for (const oldHash of history) {
    const reused = await bcrypt.compare(newPassword, oldHash);
    if (reused) throw new Error('Password was used recently. Choose a different password.');
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  const updatedHistory = [hashed, ...history].slice(0, 12);

  return await UserModel.findByIdAndUpdate(
    id,
    { password: hashed, passwordHistory: updatedHistory },
    { new: true }
  ).select('-password');
};

const updateSessionId = async (id: string, sessionId: string | null) => {
  return await UserModel.findByIdAndUpdate(id, { sessionId });
};

const incrementFailedLogin = async (email: string) => {
  const LOCK_AFTER  = 5;
  const LOCK_MINUTES = 30;
  const user = await UserModel.findOne({ email });
  if (!user) return null;
  const attempts = (user.failedLoginAttempts ?? 0) + 1;
  const update: any = { failedLoginAttempts: attempts };
  if (attempts >= LOCK_AFTER) {
    update.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
  }
  return await UserModel.findByIdAndUpdate(user._id, update, { new: true });
};

const resetFailedLogin = async (id: string) => {
  return await UserModel.findByIdAndUpdate(id, { failedLoginAttempts: 0, lockedUntil: null });
};

export default {
  findByEmail,
  findById,
  createUser,
  list,
  findByDepartments,
  updateSystemRoles,
  updateSessionId,
  updatePassword,
  incrementFailedLogin,
  resetFailedLogin,
}