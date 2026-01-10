import FrameworkModel, { CreateFrameworkDto, FrameworkDocument, FrameworkStatusEnum, UpdateFrameworkDto } from "../models/framework.model";
import ControlModel from "../models/control.model";
import { MongoIdType } from "types/mongoid.type";
import csv from 'csv-parser';
import { Readable } from 'stream';

const findById = async (id: string|MongoIdType): Promise<FrameworkDocument|null> => {
  return await FrameworkModel.findById(id);
};

const create = async (user: CreateFrameworkDto) => {
  return await FrameworkModel.create(user);
};

const update = async (id: string|MongoIdType, data: UpdateFrameworkDto) => {
  return await FrameworkModel.findByIdAndUpdate(id, data);
};

const findAllActive = async (type?: string) => {
  const filter: any = { status: FrameworkStatusEnum.active };
  if (type) {
    filter.type = type;
  }
  return await FrameworkModel.find(filter).select("displayName type").lean();
}

const createFromCsv = async (displayName: string, type: string, csvBuffer: Buffer) => {
  return new Promise((resolve, reject) => {
    const controls: any[] = [];
    const errors: string[] = [];
    const requiredColumns = ['controlId', 'displayName', 'groupId', 'groupName'];
    let rowIndex = 0;
    let headerValidated = false;
    const csvContent = csvBuffer.toString().trim();
    
    // Check if CSV is empty
    if (!csvContent) {
      return reject(new Error('CSV file is empty'));
    }
    
    const stream = Readable.from(csvContent);
    
    stream
      .pipe(csv())
      .on('data', (row) => {
        rowIndex++;
        
        // Validate headers on first row
        if (!headerValidated) {
          const csvColumns = Object.keys(row).map(col => col.trim());
          
          const missingColumns = requiredColumns.filter(col => !csvColumns.includes(col));
          if (missingColumns.length > 0) {
            return reject(new Error(`Missing required columns in CSV: ${missingColumns.join(', ')}. Found columns: ${csvColumns.join(', ')}`));
          }
          headerValidated = true;
        }
        
        // Validate required fields
        const controlId = row.controlId?.trim();
        const displayName = row.displayName?.trim();
        const groupId = row.groupId?.trim();
        const groupName = row.groupName?.trim();
        
        if (!controlId) {
          errors.push(`Row ${rowIndex}: controlId is required and cannot be empty`);
        }
        if (!displayName) {
          errors.push(`Row ${rowIndex}: displayName is required and cannot be empty`);
        }
        if (!groupId) {
          errors.push(`Row ${rowIndex}: groupId is required and cannot be empty`);
        }
        if (!groupName) {
          errors.push(`Row ${rowIndex}: groupName is required and cannot be empty`);
        }
        
        // Only add if all fields are valid
        if (controlId && displayName && groupId && groupName) {
          controls.push({
            controlId,
            displayName,
            groupId,
            groupName
          });
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

          const framework = await FrameworkModel.create({ displayName, type });
          
          const controlsWithFrameworkId = controls.map(control => ({
            ...control,
            frameworkId: framework._id
          }));

          const createdControls = await ControlModel.insertMany(controlsWithFrameworkId);
          
          resolve({
            framework,
            controlsCreated: createdControls.length,
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