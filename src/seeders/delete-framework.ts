import { connectDB } from '../database';
import FrameworkModel from '../models/framework.model';
import frameworkService from '../services/framewaork.service';
import dotenv from 'dotenv';

dotenv.config();

const deleteFramework = async (frameworkName: string) => {
  try {
    console.log(`🗑️  Starting framework deletion: ${frameworkName}`);
    
    // Connect to database
    await connectDB();
    
    // Find framework by name
    const framework = await FrameworkModel.findOne({ 
      displayName: { $regex: new RegExp(`^${frameworkName}$`, 'i') }
    });
    
    if (!framework) {
      console.error(`❌ Framework not found: ${frameworkName}`);
      console.log('\n📋 Available frameworks:');
      const allFrameworks = await FrameworkModel.find().select('displayName type');
      allFrameworks.forEach(f => console.log(`  - ${f.displayName} (${f.type})`));
      process.exit(1);
    }
    
    console.log(`\n⚠️  WARNING: This will permanently delete:`);
    console.log(`   - Framework: ${framework.displayName}`);
    console.log(`   - All controls under this framework`);
    console.log(`   - All assessments using this framework`);
    console.log(`   - All assessment comments`);
    console.log(`   - All file attachments`);
    console.log(`   - Framework mappings in common controls`);
    console.log(`\n⏳ Proceeding with deletion in 3 seconds...`);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Execute cascade delete
    const summary = await frameworkService.deleteCascade(framework._id);
    
    console.log(`\n✅ Framework deleted successfully!`);
    console.log(`\n📊 Deletion Summary:`);
    console.log(`   Framework: ${summary.framework}`);
    console.log(`   Controls deleted: ${summary.controls}`);
    console.log(`   Assessments deleted: ${summary.assessments}`);
    console.log(`   Assessment comments deleted: ${summary.assessmentComments}`);
    console.log(`   Common control mappings removed: ${summary.commonControlMappings}`);
    console.log(`   Files deleted: ${summary.filesDeleted}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Deletion failed:', error);
    process.exit(1);
  }
};

// CLI interface
if (require.main === module) {
  const frameworkName = process.argv[2];
  
  if (!frameworkName) {
    console.log(`
Usage: npm run delete-framework "<Framework Name>"

Examples:
  npm run delete-framework "SAMA CSF"
  npm run delete-framework "ISO 27001"
  npm run delete-framework "NCA CC"

⚠️  WARNING: This will permanently delete the framework and ALL associated data!
    `);
    process.exit(1);
  }
  
  deleteFramework(frameworkName);
}

export default deleteFramework;