import { connectDB } from '../database';
import ControlModel from '../models/control.model';
import FrameworkModel from '../models/framework.model';
import dotenv from 'dotenv';

dotenv.config();

const migrateControlsAddFrameworkName = async () => {
  try {
    console.log('🚀 Starting migration: Adding frameworkName to existing controls...');
    
    // Connect to database
    await connectDB();
    
    // Get all controls that don't have frameworkName
    const controlsToUpdate = await ControlModel.find({ 
      frameworkName: { $exists: false } 
    });
    
    if (controlsToUpdate.length === 0) {
      console.log('✅ No controls need migration. All controls already have frameworkName.');
      return;
    }
    
    console.log(`📊 Found ${controlsToUpdate.length} controls to update`);
    
    // Update controls in batches
    let updatedCount = 0;
    for (const control of controlsToUpdate) {
      // Get framework name
      const framework = await FrameworkModel.findById(control.frameworkId);
      if (framework) {
        await ControlModel.updateOne(
          { _id: control._id },
          { frameworkName: framework.displayName }
        );
        updatedCount++;
      } else {
        console.warn(`⚠️  Control ${control._id} has invalid frameworkId reference`);
      }
    }
    
    console.log(`✅ Migration completed! Updated ${updatedCount} controls with frameworkName`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    process.exit(0);
  }
};

// Run migration if called directly
if (require.main === module) {
  migrateControlsAddFrameworkName();
}

export default migrateControlsAddFrameworkName;