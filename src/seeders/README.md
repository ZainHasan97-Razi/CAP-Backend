# Framework Seeders

This directory contains seeders for various compliance frameworks. The seeder system is designed to be extensible, allowing easy addition of new frameworks.

## Available Frameworks

- **SAMA CSF** - Saudi Arabian Monetary Authority Cyber Security Framework

## Usage

### Command Line Interface

```bash
# Seed all frameworks
npm run seed

# Seed specific framework
npm run seed:sama

# Remove all frameworks
npm run seed:remove

# Reset all frameworks (remove + seed)
npm run seed:reset

# Manual commands
npm run seed seed "SAMA CSF"
npm run seed remove "SAMA CSF"
npm run seed reset "SAMA CSF"
```

### API Endpoints

All seeder endpoints are protected and require authentication.

#### Get Available Frameworks
```
GET /api/protected/seeder/frameworks
```

#### Seed Operations
```
POST /api/protected/seeder/seed/all
POST /api/protected/seeder/seed/:frameworkName
```

#### Remove Operations
```
DELETE /api/protected/seeder/remove/all
DELETE /api/protected/seeder/remove/:frameworkName
```

#### Reset Operations
```
POST /api/protected/seeder/reset/all
POST /api/protected/seeder/reset/:frameworkName
```

### Programmatic Usage

```typescript
import seederService from '../services/seeder.service';

// Seed all frameworks
const results = await seederService.seedAll();

// Seed specific framework
const result = await seederService.seedFramework('SAMA CSF');

// Get available frameworks
const frameworks = seederService.getAvailableFrameworks();
```

## SAMA CSF Framework Structure

The SAMA CSF framework includes 5 main domains with 47 controls:

### Domain 1: Cybersecurity Governance (CG-1)
- Board Oversight
- Cybersecurity Strategy
- Organizational Structure
- Cybersecurity Policy
- Risk Management Framework

### Domain 2: Cybersecurity Defense
- **Asset Management (CD-2)**: Asset Inventory, Classification, Handling
- **Access Control (CD-3)**: Policy, User Access, Privileged Access, Authentication
- **Data Protection (CD-4)**: Classification, Handling, DLP, Cryptography
- **Network Security (CD-5)**: Architecture, Monitoring, Access Control
- **Systems Security (CD-6)**: Endpoint Protection, Hardening, Vulnerability Management, Patch Management
- **Application Security (CD-7)**: Secure Development, Testing, Deployment

### Domain 3: Cybersecurity Resilience (CR-8)
- Business Continuity Planning
- Backup and Recovery
- Disaster Recovery
- Testing and Validation

### Domain 4: Dealing with Cybersecurity Events
- **Incident Response (CE-9)**: Planning, Detection, Analysis, Containment, Recovery, Communication
- **Security Monitoring (CE-10)**: Monitoring, Log Management, Threat Intelligence

### Domain 5: Third Party Cybersecurity Risk Management (TP-11)
- Third Party Risk Assessment
- Vendor Management
- Contractual Requirements
- Third Party Monitoring
- Supply Chain Security

## Adding New Frameworks

To add a new framework:

1. Create a new seeder file in `/src/seeders/` (e.g., `iso27001.seeder.ts`)
2. Follow the same structure as `sama-csf.seeder.ts`
3. Add the new seeder to the `frameworkSeeders` array in `/src/seeders/index.ts`

Example structure:
```typescript
export const newFrameworkData = {
  displayName: "Framework Name",
  type: FrameworkTypeEnum.regulatory_assessment // or appropriate type
};

export const newFrameworkControlsData = [
  {
    controlId: "CTRL-1.1",
    displayName: "Control Name",
    groupId: "CTRL-1",
    groupName: "Control Group Name"
  }
  // ... more controls
];

export const seedNewFramework = async () => {
  // Implementation similar to seedSamaCSF
};

export const removeNewFramework = async () => {
  // Implementation similar to removeSamaCSF
};
```

## Database Schema

### Framework Model
```typescript
{
  displayName: string;
  type: 'regulatory_assessment' | 'internal_policy_procedure' | 'international_standards';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

### Control Model
```typescript
{
  frameworkId: ObjectId; // Reference to Framework
  controlId: string;     // Unique control identifier (e.g., "CG-1.1")
  displayName: string;   // Human-readable control name
  groupId: string;       // Group identifier (e.g., "CG-1")
  groupName: string;     // Group name (e.g., "Cybersecurity Governance")
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

The seeder system includes comprehensive error handling:
- Duplicate framework detection
- Validation of framework names
- Database connection error handling
- Rollback capabilities for failed operations

## Best Practices

1. Always test seeders in development before production
2. Use the reset functionality to ensure clean state
3. Check existing data before seeding to avoid duplicates
4. Use the API endpoints for programmatic seeding in applications
5. Use CLI commands for development and deployment scripts