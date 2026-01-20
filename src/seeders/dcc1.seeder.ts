import FrameworkModel, { FrameworkTypeEnum } from '../models/framework.model';
import ControlModel from '../models/control.model';

export const dcc1FrameworkData = {
  displayName: "Data Cybersecurity Controls (DCC-1:2022)",
  type: FrameworkTypeEnum.regulatory_assessment
};

export const dcc1ControlsData = [
  // 1. Data Governance
  {
    controlId: "DG-1.1",
    displayName: "Data Governance Strategy",
    groupId: "DG-1",
    groupName: "Data Governance"
  },
  {
    controlId: "DG-1.2",
    displayName: "Data Governance Policy",
    groupId: "DG-1",
    groupName: "Data Governance"
  },
  {
    controlId: "DG-1.3",
    displayName: "Data Governance Organizational Structure",
    groupId: "DG-1",
    groupName: "Data Governance"
  },
  {
    controlId: "DG-1.4",
    displayName: "Data Governance Roles and Responsibilities",
    groupId: "DG-1",
    groupName: "Data Governance"
  },
  {
    controlId: "DG-1.5",
    displayName: "Data Governance Training and Awareness",
    groupId: "DG-1",
    groupName: "Data Governance"
  },
  {
    controlId: "DG-1.6",
    displayName: "Data Governance Performance Management",
    groupId: "DG-1",
    groupName: "Data Governance"
  },

  // 2. Data Classification
  {
    controlId: "DC-2.1",
    displayName: "Data Classification Scheme",
    groupId: "DC-2",
    groupName: "Data Classification"
  },
  {
    controlId: "DC-2.2",
    displayName: "Data Labeling and Marking",
    groupId: "DC-2",
    groupName: "Data Classification"
  },
  {
    controlId: "DC-2.3",
    displayName: "Data Handling Requirements",
    groupId: "DC-2",
    groupName: "Data Classification"
  },
  {
    controlId: "DC-2.4",
    displayName: "Data Classification Review and Update",
    groupId: "DC-2",
    groupName: "Data Classification"
  },

  // 3. Data Collection
  {
    controlId: "DCL-3.1",
    displayName: "Data Collection Policy",
    groupId: "DCL-3",
    groupName: "Data Collection"
  },
  {
    controlId: "DCL-3.2",
    displayName: "Data Subject Consent",
    groupId: "DCL-3",
    groupName: "Data Collection"
  },
  {
    controlId: "DCL-3.3",
    displayName: "Data Minimization",
    groupId: "DCL-3",
    groupName: "Data Collection"
  },
  {
    controlId: "DCL-3.4",
    displayName: "Data Collection Documentation",
    groupId: "DCL-3",
    groupName: "Data Collection"
  },
  {
    controlId: "DCL-3.5",
    displayName: "Third-Party Data Collection",
    groupId: "DCL-3",
    groupName: "Data Collection"
  },

  // 4. Data Processing
  {
    controlId: "DP-4.1",
    displayName: "Data Processing Policy",
    groupId: "DP-4",
    groupName: "Data Processing"
  },
  {
    controlId: "DP-4.2",
    displayName: "Purpose Limitation",
    groupId: "DP-4",
    groupName: "Data Processing"
  },
  {
    controlId: "DP-4.3",
    displayName: "Data Accuracy and Quality",
    groupId: "DP-4",
    groupName: "Data Processing"
  },
  {
    controlId: "DP-4.4",
    displayName: "Data Processing Security",
    groupId: "DP-4",
    groupName: "Data Processing"
  },
  {
    controlId: "DP-4.5",
    displayName: "Automated Decision Making",
    groupId: "DP-4",
    groupName: "Data Processing"
  },
  {
    controlId: "DP-4.6",
    displayName: "Data Processing Records",
    groupId: "DP-4",
    groupName: "Data Processing"
  },

  // 5. Data Storage
  {
    controlId: "DS-5.1",
    displayName: "Data Storage Security",
    groupId: "DS-5",
    groupName: "Data Storage"
  },
  {
    controlId: "DS-5.2",
    displayName: "Data Encryption at Rest",
    groupId: "DS-5",
    groupName: "Data Storage"
  },
  {
    controlId: "DS-5.3",
    displayName: "Data Storage Access Controls",
    groupId: "DS-5",
    groupName: "Data Storage"
  },
  {
    controlId: "DS-5.4",
    displayName: "Data Storage Monitoring",
    groupId: "DS-5",
    groupName: "Data Storage"
  },
  {
    controlId: "DS-5.5",
    displayName: "Data Storage Location Controls",
    groupId: "DS-5",
    groupName: "Data Storage"
  },

  // 6. Data Transmission
  {
    controlId: "DT-6.1",
    displayName: "Data Transmission Security",
    groupId: "DT-6",
    groupName: "Data Transmission"
  },
  {
    controlId: "DT-6.2",
    displayName: "Data Encryption in Transit",
    groupId: "DT-6",
    groupName: "Data Transmission"
  },
  {
    controlId: "DT-6.3",
    displayName: "Secure Communication Channels",
    groupId: "DT-6",
    groupName: "Data Transmission"
  },
  {
    controlId: "DT-6.4",
    displayName: "Data Transmission Monitoring",
    groupId: "DT-6",
    groupName: "Data Transmission"
  },

  // 7. Data Access Control
  {
    controlId: "DAC-7.1",
    displayName: "Data Access Control Policy",
    groupId: "DAC-7",
    groupName: "Data Access Control"
  },
  {
    controlId: "DAC-7.2",
    displayName: "User Authentication and Authorization",
    groupId: "DAC-7",
    groupName: "Data Access Control"
  },
  {
    controlId: "DAC-7.3",
    displayName: "Privileged Access Management",
    groupId: "DAC-7",
    groupName: "Data Access Control"
  },
  {
    controlId: "DAC-7.4",
    displayName: "Data Access Monitoring and Logging",
    groupId: "DAC-7",
    groupName: "Data Access Control"
  },
  {
    controlId: "DAC-7.5",
    displayName: "Data Access Review and Certification",
    groupId: "DAC-7",
    groupName: "Data Access Control"
  },

  // 8. Data Retention
  {
    controlId: "DR-8.1",
    displayName: "Data Retention Policy",
    groupId: "DR-8",
    groupName: "Data Retention"
  },
  {
    controlId: "DR-8.2",
    displayName: "Data Disposal and Destruction",
    groupId: "DR-8",
    groupName: "Data Retention"
  },
  {
    controlId: "DR-8.3",
    displayName: "Data Archiving",
    groupId: "DR-8",
    groupName: "Data Retention"
  },

  // 9. Data Breach Management
  {
    controlId: "DBM-9.1",
    displayName: "Data Breach Response Plan",
    groupId: "DBM-9",
    groupName: "Data Breach Management"
  },
  {
    controlId: "DBM-9.2",
    displayName: "Data Breach Detection and Assessment",
    groupId: "DBM-9",
    groupName: "Data Breach Management"
  },
  {
    controlId: "DBM-9.3",
    displayName: "Data Breach Notification",
    groupId: "DBM-9",
    groupName: "Data Breach Management"
  },
  {
    controlId: "DBM-9.4",
    displayName: "Data Breach Recovery and Remediation",
    groupId: "DBM-9",
    groupName: "Data Breach Management"
  },

  // 10. Data Privacy
  {
    controlId: "DPR-10.1",
    displayName: "Data Privacy Policy",
    groupId: "DPR-10",
    groupName: "Data Privacy"
  },
  {
    controlId: "DPR-10.2",
    displayName: "Data Subject Rights Management",
    groupId: "DPR-10",
    groupName: "Data Privacy"
  },
  {
    controlId: "DPR-10.3",
    displayName: "Consent Management",
    groupId: "DPR-10",
    groupName: "Data Privacy"
  },
  {
    controlId: "DPR-10.4",
    displayName: "Privacy Impact Assessment",
    groupId: "DPR-10",
    groupName: "Data Privacy"
  },
  {
    controlId: "DPR-10.5",
    displayName: "Data Protection Officer",
    groupId: "DPR-10",
    groupName: "Data Privacy"
  },

  // 11. Third-Party Data Management
  {
    controlId: "TPM-11.1",
    displayName: "Third-Party Data Management Policy",
    groupId: "TPM-11",
    groupName: "Third-Party Data Management"
  },
  {
    controlId: "TPM-11.2",
    displayName: "Data Sharing Agreements",
    groupId: "TPM-11",
    groupName: "Third-Party Data Management"
  },
  {
    controlId: "TPM-11.3",
    displayName: "Vendor Data Security Assessment",
    groupId: "TPM-11",
    groupName: "Third-Party Data Management"
  },
  {
    controlId: "TPM-11.4",
    displayName: "Third-Party Data Processing Monitoring",
    groupId: "TPM-11",
    groupName: "Third-Party Data Management"
  },

  // 12. Compliance and Audit
  {
    controlId: "CA-12.1",
    displayName: "Data Compliance Monitoring",
    groupId: "CA-12",
    groupName: "Compliance and Audit"
  },
  {
    controlId: "CA-12.2",
    displayName: "Data Audit Trails",
    groupId: "CA-12",
    groupName: "Compliance and Audit"
  },
  {
    controlId: "CA-12.3",
    displayName: "Data Compliance Reporting",
    groupId: "CA-12",
    groupName: "Compliance and Audit"
  }
];

export async function seedDcc1Framework() {
  try {
    console.log('Starting DCC-1:2022 framework seeding...');

    // Check if framework already exists
    const existingFramework = await FrameworkModel.findOne({
      displayName: dcc1FrameworkData.displayName
    });

    if (existingFramework) {
      console.log('DCC-1:2022 framework already exists, skipping...');
      return {
        framework: existingFramework,
        controlsCreated: 0,
        message: 'Framework already exists'
      };
    }

    // Create framework
    const framework = await FrameworkModel.create(dcc1FrameworkData);
    console.log(`Created framework: ${framework.displayName}`);

    // Create controls
    const controlsWithFrameworkId = dcc1ControlsData.map(control => ({
      ...control,
      frameworkId: framework._id,
      frameworkName: framework.displayName
    }));

    await ControlModel.insertMany(controlsWithFrameworkId);
    console.log(`Created ${dcc1ControlsData.length} controls for DCC-1:2022`);

    console.log('DCC-1:2022 framework seeding completed successfully');
    return {
      framework,
      controlsCreated: dcc1ControlsData.length,
      message: 'Framework seeded successfully'
    };
  } catch (error) {
    console.error('Error seeding DCC-1:2022 framework:', error);
    throw error;
  }
}

export async function removeDcc1Framework() {
  try {
    console.log('Removing DCC-1:2022 framework...');
    
    const framework = await FrameworkModel.findOne({
      displayName: dcc1FrameworkData.displayName
    });
    
    if (!framework) {
      console.log('DCC-1:2022 framework not found, nothing to remove');
      return;
    }
    
    await ControlModel.deleteMany({ frameworkId: framework._id });
    await FrameworkModel.deleteOne({ _id: framework._id });
    
    console.log('DCC-1:2022 framework removed successfully');
  } catch (error) {
    console.error('Error removing DCC-1:2022 framework:', error);
    throw error;
  }
}

export const seedDCC1 = seedDcc1Framework;
export const removeDCC1 = removeDcc1Framework;