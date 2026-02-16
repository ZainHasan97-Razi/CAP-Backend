import { connectDB } from '../database';
import frameworkService from '../services/framewaork.service';
import dotenv from 'dotenv';

dotenv.config();

const deleteFrameworkById = async () => {
  try {
    const frameworkId = '699053b49e039551769b4859';
    
    console.log(`🗑️  Deleting framework with ID: ${frameworkId}`);
    
    await connectDB();
    
    const summary = await frameworkService.deleteCascade(frameworkId);
    
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

deleteFrameworkById();
