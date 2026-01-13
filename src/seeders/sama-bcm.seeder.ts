import FrameworkModel, { FrameworkTypeEnum } from '../models/framework.model';
import ControlModel from '../models/control.model';

export const samaBcmFrameworkData = {
  displayName: "SAMA Business Continuity Management Framework (2017)",
  type: FrameworkTypeEnum.regulatory_assessment
};

export const samaBcmControlsData = [
  // 1. BCM Governance and Organization
  {
    controlId: "BGO-1.1",
    displayName: "BCM Policy and Strategy",
    groupId: "BGO-1",
    groupName: "BCM Governance and Organization"
  },
  {
    controlId: "BGO-1.2",
    displayName: "BCM Governance Structure",
    groupId: "BGO-1",
    groupName: "BCM Governance and Organization"
  },
  {
    controlId: "BGO-1.3",
    displayName: "BCM Roles and Responsibilities",
    groupId: "BGO-1",
    groupName: "BCM Governance and Organization"
  },
  {
    controlId: "BGO-1.4",
    displayName: "BCM Oversight and Reporting",
    groupId: "BGO-1",
    groupName: "BCM Governance and Organization"
  },
  {
    controlId: "BGO-1.5",
    displayName: "BCM Resource Allocation",
    groupId: "BGO-1",
    groupName: "BCM Governance and Organization"
  },

  // 2. Business Impact Analysis
  {
    controlId: "BIA-2.1",
    displayName: "Business Process Identification",
    groupId: "BIA-2",
    groupName: "Business Impact Analysis"
  },
  {
    controlId: "BIA-2.2",
    displayName: "Impact Assessment Methodology",
    groupId: "BIA-2",
    groupName: "Business Impact Analysis"
  },
  {
    controlId: "BIA-2.3",
    displayName: "Recovery Time Objectives (RTO)",
    groupId: "BIA-2",
    groupName: "Business Impact Analysis"
  },
  {
    controlId: "BIA-2.4",
    displayName: "Recovery Point Objectives (RPO)",
    groupId: "BIA-2",
    groupName: "Business Impact Analysis"
  },
  {
    controlId: "BIA-2.5",
    displayName: "Minimum Business Continuity Objectives (MBCO)",
    groupId: "BIA-2",
    groupName: "Business Impact Analysis"
  },
  {
    controlId: "BIA-2.6",
    displayName: "Critical Dependencies Analysis",
    groupId: "BIA-2",
    groupName: "Business Impact Analysis"
  },

  // 3. Risk Assessment
  {
    controlId: "RA-3.1",
    displayName: "Risk Identification",
    groupId: "RA-3",
    groupName: "Risk Assessment"
  },
  {
    controlId: "RA-3.2",
    displayName: "Risk Analysis and Evaluation",
    groupId: "RA-3",
    groupName: "Risk Assessment"
  },
  {
    controlId: "RA-3.3",
    displayName: "Risk Treatment Options",
    groupId: "RA-3",
    groupName: "Risk Assessment"
  },
  {
    controlId: "RA-3.4",
    displayName: "Risk Monitoring and Review",
    groupId: "RA-3",
    groupName: "Risk Assessment"
  },

  // 4. Business Continuity Strategy
  {
    controlId: "BCS-4.1",
    displayName: "Continuity Strategy Development",
    groupId: "BCS-4",
    groupName: "Business Continuity Strategy"
  },
  {
    controlId: "BCS-4.2",
    displayName: "Recovery Strategy Selection",
    groupId: "BCS-4",
    groupName: "Business Continuity Strategy"
  },
  {
    controlId: "BCS-4.3",
    displayName: "Resource Requirements",
    groupId: "BCS-4",
    groupName: "Business Continuity Strategy"
  },
  {
    controlId: "BCS-4.4",
    displayName: "Alternative Site Strategy",
    groupId: "BCS-4",
    groupName: "Business Continuity Strategy"
  },
  {
    controlId: "BCS-4.5",
    displayName: "Technology Recovery Strategy",
    groupId: "BCS-4",
    groupName: "Business Continuity Strategy"
  },

  // 5. Business Continuity Plans
  {
    controlId: "BCP-5.1",
    displayName: "Plan Development",
    groupId: "BCP-5",
    groupName: "Business Continuity Plans"
  },
  {
    controlId: "BCP-5.2",
    displayName: "Plan Structure and Content",
    groupId: "BCP-5",
    groupName: "Business Continuity Plans"
  },
  {
    controlId: "BCP-5.3",
    displayName: "Emergency Response Procedures",
    groupId: "BCP-5",
    groupName: "Business Continuity Plans"
  },
  {
    controlId: "BCP-5.4",
    displayName: "Crisis Management Procedures",
    groupId: "BCP-5",
    groupName: "Business Continuity Plans"
  },
  {
    controlId: "BCP-5.5",
    displayName: "Recovery Procedures",
    groupId: "BCP-5",
    groupName: "Business Continuity Plans"
  },
  {
    controlId: "BCP-5.6",
    displayName: "Plan Documentation and Distribution",
    groupId: "BCP-5",
    groupName: "Business Continuity Plans"
  },

  // 6. Testing and Exercising
  {
    controlId: "TE-6.1",
    displayName: "Testing Strategy and Program",
    groupId: "TE-6",
    groupName: "Testing and Exercising"
  },
  {
    controlId: "TE-6.2",
    displayName: "Test Planning and Design",
    groupId: "TE-6",
    groupName: "Testing and Exercising"
  },
  {
    controlId: "TE-6.3",
    displayName: "Test Execution",
    groupId: "TE-6",
    groupName: "Testing and Exercising"
  },
  {
    controlId: "TE-6.4",
    displayName: "Test Results Analysis",
    groupId: "TE-6",
    groupName: "Testing and Exercising"
  },
  {
    controlId: "TE-6.5",
    displayName: "Corrective Actions",
    groupId: "TE-6",
    groupName: "Testing and Exercising"
  },

  // 7. Training and Awareness
  {
    controlId: "TA-7.1",
    displayName: "BCM Training Program",
    groupId: "TA-7",
    groupName: "Training and Awareness"
  },
  {
    controlId: "TA-7.2",
    displayName: "Awareness Activities",
    groupId: "TA-7",
    groupName: "Training and Awareness"
  },
  {
    controlId: "TA-7.3",
    displayName: "Training Effectiveness Assessment",
    groupId: "TA-7",
    groupName: "Training and Awareness"
  },
  {
    controlId: "TA-7.4",
    displayName: "Competency Management",
    groupId: "TA-7",
    groupName: "Training and Awareness"
  },

  // 8. Maintenance and Review
  {
    controlId: "MR-8.1",
    displayName: "Plan Maintenance",
    groupId: "MR-8",
    groupName: "Maintenance and Review"
  },
  {
    controlId: "MR-8.2",
    displayName: "Regular Review and Updates",
    groupId: "MR-8",
    groupName: "Maintenance and Review"
  },
  {
    controlId: "MR-8.3",
    displayName: "Change Management",
    groupId: "MR-8",
    groupName: "Maintenance and Review"
  },
  {
    controlId: "MR-8.4",
    displayName: "Version Control",
    groupId: "MR-8",
    groupName: "Maintenance and Review"
  },

  // 9. Crisis Communication
  {
    controlId: "CC-9.1",
    displayName: "Communication Strategy",
    groupId: "CC-9",
    groupName: "Crisis Communication"
  },
  {
    controlId: "CC-9.2",
    displayName: "Stakeholder Communication",
    groupId: "CC-9",
    groupName: "Crisis Communication"
  },
  {
    controlId: "CC-9.3",
    displayName: "Media Relations",
    groupId: "CC-9",
    groupName: "Crisis Communication"
  },
  {
    controlId: "CC-9.4",
    displayName: "Internal Communication",
    groupId: "CC-9",
    groupName: "Crisis Communication"
  },

  // 10. Third Party Management
  {
    controlId: "TPM-10.1",
    displayName: "Third Party Risk Assessment",
    groupId: "TPM-10",
    groupName: "Third Party Management"
  },
  {
    controlId: "TPM-10.2",
    displayName: "Service Level Agreements",
    groupId: "TPM-10",
    groupName: "Third Party Management"
  },
  {
    controlId: "TPM-10.3",
    displayName: "Third Party BCM Requirements",
    groupId: "TPM-10",
    groupName: "Third Party Management"
  },
  {
    controlId: "TPM-10.4",
    displayName: "Third Party Monitoring",
    groupId: "TPM-10",
    groupName: "Third Party Management"
  }
];

export async function seedSamaBcmFramework() {
  try {
    console.log('Starting SAMA BCM Framework seeding...');

    // Check if framework already exists
    const existingFramework = await FrameworkModel.findOne({
      displayName: samaBcmFrameworkData.displayName
    });

    if (existingFramework) {
      console.log('SAMA BCM Framework already exists, skipping...');
      return {
        framework: existingFramework,
        controlsCreated: 0,
        message: 'Framework already exists'
      };
    }

    // Create framework
    const framework = await FrameworkModel.create(samaBcmFrameworkData);
    console.log(`Created framework: ${framework.displayName}`);

    // Create controls
    const controlsWithFrameworkId = samaBcmControlsData.map(control => ({
      ...control,
      frameworkId: framework._id
    }));

    await ControlModel.insertMany(controlsWithFrameworkId);
    console.log(`Created ${samaBcmControlsData.length} controls for SAMA BCM Framework`);

    console.log('SAMA BCM Framework seeding completed successfully');
    return {
      framework,
      controlsCreated: samaBcmControlsData.length,
      message: 'Framework seeded successfully'
    };
  } catch (error) {
    console.error('Error seeding SAMA BCM Framework:', error);
    throw error;
  }
}

export async function removeSamaBcmFramework() {
  try {
    console.log('Removing SAMA BCM Framework...');
    
    const framework = await FrameworkModel.findOne({
      displayName: samaBcmFrameworkData.displayName
    });
    
    if (!framework) {
      console.log('SAMA BCM Framework not found, nothing to remove');
      return;
    }
    
    await ControlModel.deleteMany({ frameworkId: framework._id });
    await FrameworkModel.deleteOne({ _id: framework._id });
    
    console.log('SAMA BCM Framework removed successfully');
  } catch (error) {
    console.error('Error removing SAMA BCM Framework:', error);
    throw error;
  }
}

export const seedSAMABCM = seedSamaBcmFramework;
export const removeSAMABCM = removeSamaBcmFramework;