import FrameworkModel, { CreateFrameworkDto, FrameworkDocument, FrameworkStatusEnum, UpdateFrameworkDto } from "../models/framework.model";
import ControlModel from "../models/control.model";
import { MongoIdType } from "types/mongoid.type";
import csv from 'csv-parser';
import { Readable } from 'stream';

const findById = async (id: string|MongoIdType): Promise<FrameworkDocument|null> => {
  return await FrameworkModel.findById(id);
};

const create = async (user: CreateFrameworkDto) => {
  const lastFramework = await FrameworkModel.findOne().sort({ displayId: -1 }).select('displayId');
  const nextDisplayId = lastFramework ? parseInt(lastFramework.displayId) + 1 : 1;
  return await FrameworkModel.create({ ...user, displayId: nextDisplayId.toString() });
};

const update = async (id: string|MongoIdType, data: UpdateFrameworkDto) => {
  return await FrameworkModel.findByIdAndUpdate(id, data);
};

const findAllActive = async (type?: string) => {
  const filter: any = { status: FrameworkStatusEnum.active };
  if (type) {
    filter.type = type;
  }
  return await FrameworkModel.find(filter).select("displayId displayName type").lean();
}

const createFromCsv = async (displayName: string, type: string, csvBuffer: Buffer) => {
  return new Promise((resolve, reject) => {
    const controls: any[] = [];
    const errors: string[] = [];
    const requiredColumns = ['domainCode', 'domainName', 'subdomainCode', 'subdomainName', 'controlCode', 'controlName'];
    let rowIndex = 0;
    let headerValidated = false;
    const csvContent = csvBuffer.toString().trim();
    
    if (!csvContent) {
      return reject(new Error('CSV file is empty'));
    }
    
    const stream = Readable.from(csvContent);
    
    stream
      .pipe(csv())
      .on('data', (row) => {
        rowIndex++;
        
        if (!headerValidated) {
          const csvColumns = Object.keys(row).map(col => col.trim());
          const missingColumns = requiredColumns.filter(col => !csvColumns.includes(col));
          if (missingColumns.length > 0) {
            return reject(new Error(`Missing required columns in CSV: ${missingColumns.join(', ')}. Found columns: ${csvColumns.join(', ')}`));
          }
          headerValidated = true;
        }
        
        const domainCode = row.domainCode?.trim();
        const domainName = row.domainName?.trim();
        const subdomainCode = row.subdomainCode?.trim();
        const subdomainName = row.subdomainName?.trim();
        const controlCode = row.controlCode?.trim();
        const controlName = row.controlName?.trim();
        
        if (!domainCode) errors.push(`Row ${rowIndex}: domainCode is required`);
        if (!domainName) errors.push(`Row ${rowIndex}: domainName is required`);
        if (!subdomainCode) errors.push(`Row ${rowIndex}: subdomainCode is required`);
        if (!subdomainName) errors.push(`Row ${rowIndex}: subdomainName is required`);
        if (!controlCode) errors.push(`Row ${rowIndex}: controlCode is required`);
        if (!controlName) errors.push(`Row ${rowIndex}: controlName is required`);
        
        if (domainCode && domainName && subdomainCode && subdomainName && controlCode && controlName) {
          controls.push({ domainCode, domainName, subdomainCode, subdomainName, controlCode, controlName });
        }
      })
      .on('end', async () => {
        try {
          if (errors.length > 0) {
            return reject(new Error(`CSV validation errors: ${errors.join(', ')}`));
          }
          
          if (controls.length === 0) {
            return reject(new Error('No valid controls found in CSV'));
          }

          const lastFramework = await FrameworkModel.findOne().sort({ displayId: -1 }).select('displayId');
          const nextDisplayId = lastFramework ? parseInt(lastFramework.displayId) + 1 : 1;
          const framework = await FrameworkModel.create({ displayName, type, displayId: nextDisplayId.toString() });
          
          const controlsWithFrameworkId = controls.map(control => ({
            ...control,
            frameworkId: framework._id,
            frameworkName: framework.displayName
          }));

          const createdControls = await ControlModel.insertMany(controlsWithFrameworkId);
          
          const uniqueDomains = new Set(controls.map(c => c.domainCode)).size;
          const uniqueSubdomains = new Set(controls.map(c => c.subdomainCode)).size;
          
          resolve({
            framework,
            domainsCount: uniqueDomains,
            subdomainsCount: uniqueSubdomains,
            controlsCount: createdControls.length,
            message: 'Framework and controls created successfully'
          });
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      });
  });
}

export default {
  findById,
  create,
  update,
  findAllActive,
  createFromCsv
}