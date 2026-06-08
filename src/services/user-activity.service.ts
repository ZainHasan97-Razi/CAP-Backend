import UserActivityModel, { UserActivityDocument } from '../models/user-activity.model';

export interface ActivityFilters {
  userId?:     string;
  startDate?:  string;
  endDate?:    string;
  page?:       string;
  action?:     string;
  method?:     string;
  statusCode?: string;
}

const buildQuery = (filters: ActivityFilters) => {
  const query: Record<string, any> = {};

  if (filters.userId)     query.userId     = filters.userId;
  if (filters.page)       query.page       = { $regex: filters.page, $options: 'i' };
  if (filters.action)     query.action     = { $regex: filters.action, $options: 'i' };
  if (filters.method)     query.method     = filters.method.toUpperCase();
  if (filters.statusCode) query.statusCode = parseInt(filters.statusCode, 10);

  if (filters.startDate || filters.endDate) {
    query.timestamp = {};
    if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      query.timestamp.$lte = end;
    }
  }

  return query;
};

const list = async (filters: ActivityFilters, pageNum = 1, limit = 20) => {
  const query = buildQuery(filters);
  const skip  = (pageNum - 1) * limit;

  const [data, total] = await Promise.all([
    UserActivityModel.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
    UserActivityModel.countDocuments(query),
  ]);

  return { data, total, page: pageNum, limit, totalPages: Math.ceil(total / limit) };
};

const exportData = async (filters: ActivityFilters): Promise<UserActivityDocument[]> => {
  const query = buildQuery(filters);
  return UserActivityModel.find(query).sort({ timestamp: -1 }).lean() as any;
};

const create = async (data: Partial<UserActivityDocument>) => {
  await UserActivityModel.create(data);
};

export default { list, exportData, create };
