import FrameworkModel, { CreateFrameworkDto, FrameworkDocument, FrameworkStatusEnum, UpdateFrameworkDto } from "../models/framework.model";
import ControlModel from "../models/control.model";
import AssesmentModel from "../models/assesment.model";
import AssesmentCommentModel from "../models/assesment-comment.model";
import CommonControlModel from "../models/common-control.model";
import { MongoIdType } from "types/mongoid.type";
import csv from 'csv-parser';
import { Readable } from 'stream';
import storage from "../config/storage.provider";

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
    const requiredColumns = ['domainCode', 'domainName', 'controlCode', 'controlName'];
    const optionalColumns = ['subdomainCode', 'subdomainName'];
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
        const subdomainCode = row.subdomainCode?.trim() || '';
        const subdomainName = row.subdomainName?.trim() || '';
        const controlCode = row.controlCode?.trim();
        const controlName = row.controlName?.trim();
        
        if (!domainCode) errors.push(`Row ${rowIndex}: domainCode is required`);
        if (!domainName) errors.push(`Row ${rowIndex}: domainName is required`);
        if (!controlCode) errors.push(`Row ${rowIndex}: controlCode is required`);
        if (!controlName) errors.push(`Row ${rowIndex}: controlName is required`);
        
        if (domainCode && domainName && controlCode && controlName) {
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

const deleteCascade = async (frameworkId: string|MongoIdType) => {
  const framework = await FrameworkModel.findById(frameworkId);
  if (!framework) {
    throw new Error('Framework not found');
  }

  const deletionSummary = {
    framework: framework.displayName,
    controls: 0,
    assessments: 0,
    assessmentComments: 0,
    commonControlMappings: 0,
    filesDeleted: 0
  };

  // 1. Get all assessments for this framework (to collect file attachments)
  const assessments = await AssesmentModel.find({ framework: frameworkId });
  const assessmentIds = assessments.map(a => a._id);
  
  // Collect all attachment URLs
  const attachmentUrls: string[] = [];
  assessments.forEach(assessment => {
    if (assessment.attachments && assessment.attachments.length > 0) {
      attachmentUrls.push(...assessment.attachments);
    }
  });

  // 2. Get assessment comments (they may have attachments too)
  if (assessmentIds.length > 0) {
    const comments = await AssesmentCommentModel.find({ assessmentId: { $in: assessmentIds } });
    comments.forEach(comment => {
      if (comment.attachments && comment.attachments.length > 0) {
        attachmentUrls.push(...comment.attachments);
      }
    });
    
    // Delete assessment comments
    const commentsResult = await AssesmentCommentModel.deleteMany({ assessmentId: { $in: assessmentIds } });
    deletionSummary.assessmentComments = commentsResult.deletedCount || 0;
  }

  // 3. Delete file attachments from storage
  for (const fileUrl of attachmentUrls) {
    try {
      await storage.deleteFile(fileUrl);
      deletionSummary.filesDeleted++;
    } catch (error) {
      console.warn(`Failed to delete file: ${fileUrl}`, error);
    }
  }

  // 4. Delete assessments
  const assessmentsResult = await AssesmentModel.deleteMany({ framework: frameworkId });
  deletionSummary.assessments = assessmentsResult.deletedCount || 0;

  // 5. Remove framework from common control mappings
  const commonControls = await CommonControlModel.find({ 'mappedControls.frameworkId': frameworkId });
  for (const commonControl of commonControls) {
    const updatedMappings = commonControl.mappedControls.filter(
      (mapping: any) => mapping.frameworkId.toString() !== frameworkId.toString()
    );
    await CommonControlModel.updateOne(
      { _id: commonControl._id },
      { mappedControls: updatedMappings }
    );
    deletionSummary.commonControlMappings++;
  }

  // 6. Delete controls
  const controlsResult = await ControlModel.deleteMany({ frameworkId });
  deletionSummary.controls = controlsResult.deletedCount || 0;

  // 7. Delete framework
  await FrameworkModel.findByIdAndDelete(frameworkId);

  return deletionSummary;
}

export default {
  findById,
  create,
  update,
  findAllActive,
  createFromCsv,
  deleteCascade
}