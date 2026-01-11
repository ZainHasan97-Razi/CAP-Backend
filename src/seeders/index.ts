import { seedSamaCSF, removeSamaCSF } from './sama-csf.seeder';
import { seedISO27001, removeISO27001 } from './iso27001.seeder';
import { seedISO27002, removeISO27002 } from './iso27002.seeder';
import { seedNCACC, removeNCACC } from './nca-cc.seeder';
import { seedSAMAPSP, removeSAMAPSP } from './sama-psp.seeder';
import { connectDB } from '../database'; // Ensure database connection
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface SeederResult {
  framework: any;
  controlsCreated: number;
  message: string;
}

export interface FrameworkSeeder {
  name: string;
  seed: () => Promise<SeederResult>;
  remove: () => Promise<void>;
}

// Registry of available framework seeders
export const frameworkSeeders: FrameworkSeeder[] = [
  {
    name: 'SAMA CSF',
    seed: seedSamaCSF,
    remove: removeSamaCSF
  },
  {
    name: 'ISO 27001',
    seed: seedISO27001,
    remove: removeISO27001
  },
  {
    name: 'ISO 27002',
    seed: seedISO27002,
    remove: removeISO27002
  },
  {
    name: 'NCA CC',
    seed: seedNCACC,
    remove: removeNCACC
  },
  {
    name: 'SAMA PSP',
    seed: seedSAMAPSP,
    remove: removeSAMAPSP
  }
];

export const seedAllFrameworks = async (): Promise<SeederResult[]> => {
  console.log('Starting to seed all frameworks...');
  const results: SeederResult[] = [];

  for (const seeder of frameworkSeeders) {
    try {
      console.log(`\n--- Seeding ${seeder.name} ---`);
      const result = await seeder.seed();
      results.push(result);
      console.log(`✅ ${seeder.name} seeded successfully`);
    } catch (error) {
      console.error(`❌ Error seeding ${seeder.name}:`, error);
      throw error;
    }
  }

  console.log('\n🎉 All frameworks seeded successfully!');
  return results;
};

export const seedSpecificFramework = async (frameworkName: string): Promise<SeederResult> => {
  const seeder = frameworkSeeders.find(s => 
    s.name.toLowerCase() === frameworkName.toLowerCase()
  );

  if (!seeder) {
    throw new Error(`Framework seeder not found: ${frameworkName}`);
  }

  console.log(`Seeding ${seeder.name}...`);
  const result = await seeder.seed();
  console.log(`✅ ${seeder.name} seeded successfully`);
  
  return result;
};

export const removeAllFrameworks = async (): Promise<void> => {
  console.log('Starting to remove all frameworks...');

  for (const seeder of frameworkSeeders) {
    try {
      console.log(`\n--- Removing ${seeder.name} ---`);
      await seeder.remove();
      console.log(`✅ ${seeder.name} removed successfully`);
    } catch (error) {
      console.error(`❌ Error removing ${seeder.name}:`, error);
      throw error;
    }
  }

  console.log('\n🗑️ All frameworks removed successfully!');
};

export const removeSpecificFramework = async (frameworkName: string): Promise<void> => {
  const seeder = frameworkSeeders.find(s => 
    s.name.toLowerCase() === frameworkName.toLowerCase()
  );

  if (!seeder) {
    throw new Error(`Framework seeder not found: ${frameworkName}`);
  }

  console.log(`Removing ${seeder.name}...`);
  await seeder.remove();
  console.log(`✅ ${seeder.name} removed successfully`);
};

// CLI interface for running seeders
if (require.main === module) {
  const command = process.argv[2];
  const frameworkName = process.argv[3];

  (async () => {
    try {
      // Initialize database connection
      connectDB();
      
      // Wait for connection to be established
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      switch (command) {
        case 'seed':
          if (frameworkName) {
            await seedSpecificFramework(frameworkName);
          } else {
            await seedAllFrameworks();
          }
          break;
        
        case 'remove':
          if (frameworkName) {
            await removeSpecificFramework(frameworkName);
          } else {
            await removeAllFrameworks();
          }
          break;
        
        case 'reset':
          if (frameworkName) {
            await removeSpecificFramework(frameworkName);
            await seedSpecificFramework(frameworkName);
          } else {
            await removeAllFrameworks();
            await seedAllFrameworks();
          }
          break;
        
        default:
          console.log(`
Usage: npm run seed [command] [framework]

Commands:
  seed [framework]    - Seed all frameworks or specific framework
  remove [framework]  - Remove all frameworks or specific framework  
  reset [framework]   - Reset (remove + seed) all frameworks or specific framework

Available frameworks:
${frameworkSeeders.map(s => `  - ${s.name}`).join('\n')}

Examples:
  npm run seed                    # Seed all frameworks
  npm run seed seed "SAMA CSF"    # Seed only SAMA CSF
  npm run seed remove             # Remove all frameworks
  npm run seed reset "SAMA CSF"   # Reset SAMA CSF
          `);
      }
      process.exit(0);
    } catch (error) {
      console.error('Seeder error:', error);
      process.exit(1);
    }
  })();
}