import RoleModel, { CreateRoleDto } from "../models/role.model";
import { MongoIdType } from "types/mongoid.type";

const findAll = async () => {
  return await RoleModel.find().sort({ name: 1 }).select("name description").lean();
};

const findById = async (id: string | MongoIdType) => {
  return await RoleModel.findById(id);
};

const findByName = async (name: string) => {
  return await RoleModel.findOne({ name: name.trim() });
};

const create = async (payload: CreateRoleDto) => {
  return await RoleModel.create(payload);
};

const findOrCreateRole = async (roleName: string) => {
  const trimmedName = roleName.trim();
  let role = await findByName(trimmedName);
  
  if (!role) {
    role = await create({ name: trimmedName, description: undefined });
  }
  
  return role;
};

export default {
  findAll,
  findById,
  findByName,
  create,
  findOrCreateRole,
};
