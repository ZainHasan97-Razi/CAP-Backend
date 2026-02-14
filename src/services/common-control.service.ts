import CommonControlModel, { CreateCommonControlDto, UpdateCommonControlDto } from "../models/common-control.model";
import ControlModel from "../models/control.model";
import FrameworkModel from "../models/framework.model";
import { MongoIdType } from "types/mongoid.type";
import { Readable } from "stream";
import csv from "csv-parser";

interface CommonControlListFilters {
  search?: string;
  frameworkId?: string;
  page?: number;
  limit?: number;
}

interface CSVRow {
  displayName: string;
  description: string;
  controlIds: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value?: string;
}

const findById = async (id: string|MongoIdType) => {
  return await CommonControlModel.findById(id)
    .populate('mappedControls.frameworkId', 'displayName')
    .populate('mappedControls.controlId', 'controlCode controlName');
};

const create = async (data: CreateCommonControlDto) => {
  return await CommonControlModel.create(data);
};

const update = async (id: string|MongoIdType, data: UpdateCommonControlDto) => {
  return await CommonControlModel.findByIdAndUpdate(id, data, { new: true });
};

const list = async (filters: CommonControlListFilters = {}) => {
  const { search, frameworkId, page = 1, limit = 10 } = filters;
  
  const query: any = {};
  
  if (search) {
    query.$or = [
      { displayName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (frameworkId) {
    query['mappedControls.frameworkId'] = frameworkId;
  }
  
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    CommonControlModel.find(query)
      .populate('mappedControls.frameworkId', 'displayName')
      .populate('mappedControls.controlId', 'controlCode controlName')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CommonControlModel.countDocuments(query)
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

const findByFramework = async (frameworkId: string|MongoIdType) => {
  return await CommonControlModel.find({
    'mappedControls.frameworkId': frameworkId
  }).populate('mappedControls.frameworkId', 'displayName')
    .populate('mappedControls.controlId', 'controlCode controlName');
};

const findCommonControlsByControlId = async (controlId: string|MongoIdType) => {
  return await CommonControlModel.find({
    'mappedControls.controlId': controlId
  }).populate('mappedControls.frameworkId', 'displayName')
    .populate('mappedControls.controlId', 'controlCode controlName');
};

const bulkCreateFromCSV = async (fileBuffer: Buffer) => {
  const errors: ValidationError[] = [];
  const rows: CSVRow[] = [];
  let rowNumber = 1; // Start from 1 (header is row 0)

  // Parse CSV
  await new Promise<void>((resolve, reject) => {
    const stream = Readable.from(fileBuffer.toString());
    stream
      .pipe(csv())
      .on('data', (data: any) => {
        rowNumber++;
        rows.push({
          displayName: data.displayName?.trim() || '',
          description: data.description?.trim() || '',
          controlIds: data.controlIds?.trim() || ''
        });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  // Validate all rows first
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const currentRow = i + 2; // +2 because: array is 0-indexed, and row 1 is header

    // Validate required fields
    if (!row.displayName) {
      errors.push({ row: currentRow, field: 'displayName', message: 'Display name is required' });
    }
    if (!row.description) {
      errors.push({ row: currentRow, field: 'description', message: 'Description is required' });
    }
    if (!row.controlIds) {
      errors.push({ row: currentRow, field: 'controlIds', message: 'Control IDs are required' });
      continue;
    }

    // Parse and validate controlIds format
    const controlIdPairs = row.controlIds.split(',').map(id => id.trim()).filter(id => id);
    if (controlIdPairs.length === 0) {
      errors.push({ row: currentRow, field: 'controlIds', message: 'At least one control ID pair is required' });
      continue;
    }

    for (const pair of controlIdPairs) {
      const parts = pair.split('-');
      if (parts.length < 2) {
        errors.push({ 
          row: currentRow, 
          field: 'controlIds', 
          message: 'Invalid format. Expected: frameworkDisplayId-controlId', 
          value: pair 
        });
      }
    }
  }

  // If validation errors exist, return them
  if (errors.length > 0) {
    throw { validationErrors: errors };
  }

  // Collect all framework displayIds and control codes
  const frameworkDisplayIds = new Set<string>();
  const controlPairs: Array<{frameworkDisplayId: string, controlCode: string}> = [];
  
  for (const row of rows) {
    const controlIdPairs = row.controlIds.split(',').map(id => id.trim()).filter(id => id);
    for (const pair of controlIdPairs) {
      const parts = pair.split('-');
      const frameworkDisplayId = parts[0];
      const controlCode = parts.slice(1).join('-'); // Handle control codes with hyphens
      frameworkDisplayIds.add(frameworkDisplayId);
      controlPairs.push({ frameworkDisplayId, controlCode });
    }
  }

  // Fetch all frameworks by displayId
  const frameworks = await FrameworkModel.find({
    displayId: { $in: Array.from(frameworkDisplayIds) }
  }).select('_id displayId displayName');

  const frameworkMap = new Map(frameworks.map(f => [f.displayId, f]));

  // Verify all frameworks exist
  for (const displayId of frameworkDisplayIds) {
    if (!frameworkMap.has(displayId)) {
      errors.push({ 
        row: 0, 
        field: 'controlIds', 
        message: 'Framework not found', 
        value: displayId 
      });
    }
  }

  if (errors.length > 0) {
    throw { validationErrors: errors };
  }

  // Fetch all controls by framework and controlId
  const controls = await ControlModel.find({
    $or: controlPairs.map(cp => {
      const framework = frameworkMap.get(cp.frameworkDisplayId);
      return {
        frameworkId: framework?._id,
        controlCode: cp.controlCode
      };
    })
  }).select('_id frameworkId frameworkName controlCode controlName');

  const controlMap = new Map(
    controls.map(c => [`${c.frameworkId.toString()}-${c.controlCode}`, c])
  );

  // Validate that all referenced controls exist
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const currentRow = i + 2;
    const controlIdPairs = row.controlIds.split(',').map(id => id.trim()).filter(id => id);
    
    for (const pair of controlIdPairs) {
      const parts = pair.split('-');
      const frameworkDisplayId = parts[0];
      const controlCode = parts.slice(1).join('-');
      const framework = frameworkMap.get(frameworkDisplayId);
      
      if (framework) {
        const controlKey = `${framework._id.toString()}-${controlCode}`;
        if (!controlMap.has(controlKey)) {
          errors.push({ 
            row: currentRow, 
            field: 'controlIds', 
            message: 'Control not found in framework', 
            value: pair 
          });
        }
      }
    }
  }

  // If validation errors exist after DB check, return them
  if (errors.length > 0) {
    throw { validationErrors: errors };
  }

  // Create common controls
  const commonControls = rows.map(row => {
    const controlIdPairs = row.controlIds.split(',').map(id => id.trim()).filter(id => id);
    const mappedControls = controlIdPairs.map(pair => {
      const parts = pair.split('-');
      const frameworkDisplayId = parts[0];
      const controlCode = parts.slice(1).join('-');
      const framework = frameworkMap.get(frameworkDisplayId)!;
      const controlKey = `${framework._id.toString()}-${controlCode}`;
      const control = controlMap.get(controlKey)!;
      return {
        frameworkId: control.frameworkId,
        frameworkName: control.frameworkName,
        controlId: control._id,
        controlCode: control.controlCode,
        controlName: control.controlName
      };
    });

    return {
      displayName: row.displayName,
      description: row.description,
      mappedControls
    };
  });

  const result = await CommonControlModel.insertMany(commonControls);
  return { created: result.length };
};

export default {
  findById,
  create,
  update,
  list,
  findByFramework,
  findCommonControlsByControlId,
  bulkCreateFromCSV,
};