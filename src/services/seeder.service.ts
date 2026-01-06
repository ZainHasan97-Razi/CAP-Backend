import { 
  seedAllFrameworks, 
  seedSpecificFramework, 
  removeAllFrameworks, 
  removeSpecificFramework,
  frameworkSeeders,
  SeederResult 
} from '../seeders';

class SeederService {
  async seedAll(): Promise<SeederResult[]> {
    return await seedAllFrameworks();
  }

  async seedFramework(frameworkName: string): Promise<SeederResult> {
    return await seedSpecificFramework(frameworkName);
  }

  async removeAll(): Promise<void> {
    return await removeAllFrameworks();
  }

  async removeFramework(frameworkName: string): Promise<void> {
    return await removeSpecificFramework(frameworkName);
  }

  async resetAll(): Promise<SeederResult[]> {
    await this.removeAll();
    return await this.seedAll();
  }

  async resetFramework(frameworkName: string): Promise<SeederResult> {
    await this.removeFramework(frameworkName);
    return await this.seedFramework(frameworkName);
  }

  getAvailableFrameworks(): string[] {
    return frameworkSeeders.map(seeder => seeder.name);
  }
}

const seederService = new SeederService();
export default seederService;