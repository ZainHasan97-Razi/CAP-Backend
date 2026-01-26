import SystemLogModel, { CreateSystemLogDto } from "../models/system-log.model";

const log = async (data: CreateSystemLogDto) => {
  try {
    await SystemLogModel.create(data);
  } catch (error) {
    console.error('Failed to create system log:', error);
  }
};

const logError = async (
  operation: string,
  error: any,
  context: {
    controllerName?: string;
    serviceName?: string;
    apiUrl?: string;
    requestData?: any;
    userId?: string;
  } = {}
) => {
  await log({
    operation,
    controllerName: context.controllerName,
    serviceName: context.serviceName,
    apiUrl: context.apiUrl,
    responseCode: 500,
    requestData: context.requestData,
    responseData: { error: error.message || error },
    userId: context.userId
  });
};

const logSuccess = async (
  operation: string,
  responseData: any,
  context: {
    controllerName?: string;
    serviceName?: string;
    apiUrl?: string;
    requestData?: any;
    userId?: string;
    responseCode?: number;
  } = {}
) => {
  await log({
    operation,
    controllerName: context.controllerName,
    serviceName: context.serviceName,
    apiUrl: context.apiUrl,
    responseCode: context.responseCode || 200,
    requestData: context.requestData,
    responseData,
    userId: context.userId
  });
};

export default {
  log,
  logError,
  logSuccess,
};