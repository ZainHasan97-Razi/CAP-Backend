import { connectDB } from '../database';
import ControlModel from '../models/control.model';
import dotenv from 'dotenv';
import { sanitizeSpecialChars } from '../utils/sanitize.chars';

dotenv.config();

const migrateSpecialChars = async () => {
  try {
    console.log('🚀 Starting migration: Fixing special characters in controls...');

    await connectDB();
    await new Promise(resolve => setTimeout(resolve, 2000));

    const controls = await ControlModel.find({}).lean();
    console.log(`📊 Found ${controls.length} controls to process`);

    let updatedCount = 0;

    for (const control of controls) {
      const sanitizedDomainName = sanitizeSpecialChars(control.domainName);
      const sanitizedSubdomainName = control.subdomainName ? sanitizeSpecialChars(control.subdomainName) : control.subdomainName;
      const sanitizedControlName = sanitizeSpecialChars(control.controlName);
      const sanitizedDescription = control.description ? sanitizeSpecialChars(control.description) : control.description;

      // Sanitize properties map
      const sanitizedProperties: Record<string, string> = {};
      let propertiesChanged = false;
      if (control.properties) {
        for (const [key, value] of Object.entries(control.properties)) {
          const sanitizedValue = sanitizeSpecialChars(value as string);
          sanitizedProperties[key] = sanitizedValue;
          if (sanitizedValue !== value) propertiesChanged = true;
        }
      }

      const hasChanges =
        sanitizedDomainName !== control.domainName ||
        sanitizedSubdomainName !== control.subdomainName ||
        sanitizedControlName !== control.controlName ||
        sanitizedDescription !== control.description ||
        propertiesChanged;

      if (hasChanges) {
        await ControlModel.updateOne(
          { _id: control._id },
          {
            domainName: sanitizedDomainName,
            subdomainName: sanitizedSubdomainName,
            controlName: sanitizedControlName,
            description: sanitizedDescription,
            ...(propertiesChanged && { properties: sanitizedProperties }),
          }
        );
        updatedCount++;
      }
    }

    console.log(`✅ Migration completed! Updated ${updatedCount} out of ${controls.length} controls`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    process.exit(0);
  }
};

if (require.main === module) {
  migrateSpecialChars();
}

export default migrateSpecialChars;
