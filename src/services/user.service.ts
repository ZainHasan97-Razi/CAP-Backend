import UserModel, { CreateUserDto } from "../models/user.model";
import { MongoIdType } from "types/mongoid.type";

const findByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};

const findById = async (id: string|MongoIdType) => {
  return await UserModel.findById(id);
};

const createUser = async (user: CreateUserDto) => {
  return await UserModel.create(user);
};

export default {
  findByEmail,
  findById,
  createUser,
}