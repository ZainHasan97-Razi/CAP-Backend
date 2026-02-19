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

export default {
  findByEmail,
  findById,
  createUser,
  list,
  findByDepartments,
}