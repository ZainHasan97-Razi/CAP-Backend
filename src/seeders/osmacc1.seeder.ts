import FrameworkModel, { FrameworkTypeEnum } from '../models/framework.model';
import ControlModel from '../models/control.model';

export const osmacc1FrameworkData = {
  displayName: "OSMACC-1:2021",
  type: FrameworkTypeEnum.regulatory_assessment
};

export const osmacc1ControlsData = [
  // Domain 1: Social Media Governance
  {
    controlId: "OSMACC-1.1.1",
    displayName: "Social Media Governance Framework",
    groupId: "OSMACC-1.1",
    groupName: "Social Media Governance"
  },
  {
    controlId: "OSMACC-1.1.2",
    displayName: "Social Media Policy and Procedures",
    groupId: "OSMACC-1.1",
    groupName: "Social Media Governance"
  },
  {
    controlId: "OSMACC-1.1.3",
    displayName: "Social Media Roles and Responsibilities",
    groupId: "OSMACC-1.1",
    groupName: "Social Media Governance"
  },
  {
    controlId: "OSMACC-1.1.4",
    displayName: "Social Media Strategy Alignment",
    groupId: "OSMACC-1.1",
    groupName: "Social Media Governance"
  },
  {
    controlId: "OSMACC-1.1.5",
    displayName: "Social Media Approval Processes",
    groupId: "OSMACC-1.1",
    groupName: "Social Media Governance"
  },
  {
    controlId: "OSMACC-1.1.6",
    displayName: "Social Media Performance Monitoring",
    groupId: "OSMACC-1.1",
    groupName: "Social Media Governance"
  },

  // Domain 2: Social Media Risk Management
  {
    controlId: "OSMACC-1.2.1",
    displayName: "Social Media Risk Assessment",
    groupId: "OSMACC-1.2",
    groupName: "Social Media Risk Management"
  },
  {
    controlId: "OSMACC-1.2.2",
    displayName: "Brand Reputation Risk Management",
    groupId: "OSMACC-1.2",
    groupName: "Social Media Risk Management"
  },
  {
    controlId: "OSMACC-1.2.3",
    displayName: "Social Engineering Risk Mitigation",
    groupId: "OSMACC-1.2",
    groupName: "Social Media Risk Management"
  },
  {
    controlId: "OSMACC-1.2.4",
    displayName: "Information Disclosure Risk Management",
    groupId: "OSMACC-1.2",
    groupName: "Social Media Risk Management"
  },
  {
    controlId: "OSMACC-1.2.5",
    displayName: "Social Media Crisis Management",
    groupId: "OSMACC-1.2",
    groupName: "Social Media Risk Management"
  },

  // Domain 3: Account Management and Access Control
  {
    controlId: "OSMACC-1.3.1",
    displayName: "Social Media Account Registration",
    groupId: "OSMACC-1.3",
    groupName: "Account Management and Access Control"
  },
  {
    controlId: "OSMACC-1.3.2",
    displayName: "Account Access Control",
    groupId: "OSMACC-1.3",
    groupName: "Account Management and Access Control"
  },
  {
    controlId: "OSMACC-1.3.3",
    displayName: "Multi-Factor Authentication",
    groupId: "OSMACC-1.3",
    groupName: "Account Management and Access Control"
  },
  {
    controlId: "OSMACC-1.3.4",
    displayName: "Privileged Account Management",
    groupId: "OSMACC-1.3",
    groupName: "Account Management and Access Control"
  },
  {
    controlId: "OSMACC-1.3.5",
    displayName: "Account Verification and Authentication",
    groupId: "OSMACC-1.3",
    groupName: "Account Management and Access Control"
  },
  {
    controlId: "OSMACC-1.3.6",
    displayName: "Access Review and Audit",
    groupId: "OSMACC-1.3",
    groupName: "Account Management and Access Control"
  },
  {
    controlId: "OSMACC-1.3.7",
    displayName: "Account Deactivation and Termination",
    groupId: "OSMACC-1.3",
    groupName: "Account Management and Access Control"
  },
  {
    controlId: "OSMACC-1.3.8",
    displayName: "Password and Credential Management",
    groupId: "OSMACC-1.3",
    groupName: "Account Management and Access Control"
  },

  // Domain 4: Content Management and Publishing
  {
    controlId: "OSMACC-1.4.1",
    displayName: "Content Creation Guidelines",
    groupId: "OSMACC-1.4",
    groupName: "Content Management and Publishing"
  },
  {
    controlId: "OSMACC-1.4.2",
    displayName: "Content Review and Approval",
    groupId: "OSMACC-1.4",
    groupName: "Content Management and Publishing"
  },
  {
    controlId: "OSMACC-1.4.3",
    displayName: "Content Classification and Labeling",
    groupId: "OSMACC-1.4",
    groupName: "Content Management and Publishing"
  },
  {
    controlId: "OSMACC-1.4.4",
    displayName: "Sensitive Information Protection",
    groupId: "OSMACC-1.4",
    groupName: "Content Management and Publishing"
  },
  {
    controlId: "OSMACC-1.4.5",
    displayName: "Content Scheduling and Publishing",
    groupId: "OSMACC-1.4",
    groupName: "Content Management and Publishing"
  },
  {
    controlId: "OSMACC-1.4.6",
    displayName: "Content Archiving and Retention",
    groupId: "OSMACC-1.4",
    groupName: "Content Management and Publishing"
  },
  {
    controlId: "OSMACC-1.4.7",
    displayName: "Content Removal and Correction",
    groupId: "OSMACC-1.4",
    groupName: "Content Management and Publishing"
  },

  // Domain 5: Privacy and Data Protection
  {
    controlId: "OSMACC-1.5.1",
    displayName: "Personal Data Protection",
    groupId: "OSMACC-1.5",
    groupName: "Privacy and Data Protection"
  },
  {
    controlId: "OSMACC-1.5.2",
    displayName: "User Consent Management",
    groupId: "OSMACC-1.5",
    groupName: "Privacy and Data Protection"
  },
  {
    controlId: "OSMACC-1.5.3",
    displayName: "Data Collection and Processing",
    groupId: "OSMACC-1.5",
    groupName: "Privacy and Data Protection"
  },
  {
    controlId: "OSMACC-1.5.4",
    displayName: "Privacy Settings Configuration",
    groupId: "OSMACC-1.5",
    groupName: "Privacy and Data Protection"
  },
  {
    controlId: "OSMACC-1.5.5",
    displayName: "Data Sharing and Third Party Integration",
    groupId: "OSMACC-1.5",
    groupName: "Privacy and Data Protection"
  },
  {
    controlId: "OSMACC-1.5.6",
    displayName: "Data Breach Notification",
    groupId: "OSMACC-1.5",
    groupName: "Privacy and Data Protection"
  },

  // Domain 6: Monitoring and Response
  {
    controlId: "OSMACC-1.6.1",
    displayName: "Social Media Monitoring",
    groupId: "OSMACC-1.6",
    groupName: "Monitoring and Response"
  },
  {
    controlId: "OSMACC-1.6.2",
    displayName: "Threat Detection and Analysis",
    groupId: "OSMACC-1.6",
    groupName: "Monitoring and Response"
  },
  {
    controlId: "OSMACC-1.6.3",
    displayName: "Suspicious Activity Detection",
    groupId: "OSMACC-1.6",
    groupName: "Monitoring and Response"
  },
  {
    controlId: "OSMACC-1.6.4",
    displayName: "Response to Security Incidents",
    groupId: "OSMACC-1.6",
    groupName: "Monitoring and Response"
  },
  {
    controlId: "OSMACC-1.6.5",
    displayName: "Community Management and Engagement",
    groupId: "OSMACC-1.6",
    groupName: "Monitoring and Response"
  },

  // Domain 7: Third Party Integration
  {
    controlId: "OSMACC-1.7.1",
    displayName: "Third Party Application Security",
    groupId: "OSMACC-1.7",
    groupName: "Third Party Integration"
  },
  {
    controlId: "OSMACC-1.7.2",
    displayName: "API Security and Management",
    groupId: "OSMACC-1.7",
    groupName: "Third Party Integration"
  },
  {
    controlId: "OSMACC-1.7.3",
    displayName: "Social Media Management Tools",
    groupId: "OSMACC-1.7",
    groupName: "Third Party Integration"
  },
  {
    controlId: "OSMACC-1.7.4",
    displayName: "Vendor Risk Assessment",
    groupId: "OSMACC-1.7",
    groupName: "Third Party Integration"
  },

  // Domain 8: Training and Awareness
  {
    controlId: "OSMACC-1.8.1",
    displayName: "Social Media Security Training",
    groupId: "OSMACC-1.8",
    groupName: "Training and Awareness"
  },
  {
    controlId: "OSMACC-1.8.2",
    displayName: "Employee Awareness Programs",
    groupId: "OSMACC-1.8",
    groupName: "Training and Awareness"
  },
  {
    controlId: "OSMACC-1.8.3",
    displayName: "Social Engineering Awareness",
    groupId: "OSMACC-1.8",
    groupName: "Training and Awareness"
  },
  {
    controlId: "OSMACC-1.8.4",
    displayName: "Continuous Education and Updates",
    groupId: "OSMACC-1.8",
    groupName: "Training and Awareness"
  },

  // Domain 9: Incident Management
  {
    controlId: "OSMACC-1.9.1",
    displayName: "Social Media Incident Response Plan",
    groupId: "OSMACC-1.9",
    groupName: "Incident Management"
  },
  {
    controlId: "OSMACC-1.9.2",
    displayName: "Incident Detection and Reporting",
    groupId: "OSMACC-1.9",
    groupName: "Incident Management"
  },
  {
    controlId: "OSMACC-1.9.3",
    displayName: "Incident Containment and Recovery",
    groupId: "OSMACC-1.9",
    groupName: "Incident Management"
  },
  {
    controlId: "OSMACC-1.9.4",
    displayName: "Communication During Incidents",
    groupId: "OSMACC-1.9",
    groupName: "Incident Management"
  },
  {
    controlId: "OSMACC-1.9.5",
    displayName: "Post-Incident Analysis and Improvement",
    groupId: "OSMACC-1.9",
    groupName: "Incident Management"
  },

  // Domain 10: Compliance and Audit
  {
    controlId: "OSMACC-1.10.1",
    displayName: "Regulatory Compliance",
    groupId: "OSMACC-1.10",
    groupName: "Compliance and Audit"
  },
  {
    controlId: "OSMACC-1.10.2",
    displayName: "Social Media Audit and Assessment",
    groupId: "OSMACC-1.10",
    groupName: "Compliance and Audit"
  },
  {
    controlId: "OSMACC-1.10.3",
    displayName: "Documentation and Record Keeping",
    groupId: "OSMACC-1.10",
    groupName: "Compliance and Audit"
  }
];

export const seedOSMACC1 = async () => {
  try {
    console.log('Starting OSMACC-1:2021 seeding...');

    const existingFramework = await FrameworkModel.findOne({ 
      displayName: osmacc1FrameworkData.displayName 
    });

    let framework;
    if (existingFramework) {
      console.log('OSMACC-1:2021 framework already exists, using existing one...');
      framework = existingFramework;
    } else {
      framework = await FrameworkModel.create(osmacc1FrameworkData);
      console.log('OSMACC-1:2021 framework created successfully');
    }

    const existingControlsCount = await ControlModel.countDocuments({ 
      frameworkId: framework._id 
    });

    if (existingControlsCount > 0) {
      console.log(`${existingControlsCount} controls already exist for OSMACC-1:2021 framework`);
      return {
        framework,
        controlsCreated: 0,
        message: 'Framework and controls already exist'
      };
    }

    const controlsWithFrameworkId = osmacc1ControlsData.map(control => ({
      ...control,
      frameworkId: framework._id
    }));

    const controls = await ControlModel.insertMany(controlsWithFrameworkId);
    
    console.log(`Successfully created ${controls.length} controls for OSMACC-1:2021 framework`);
    
    return {
      framework,
      controlsCreated: controls.length,
      message: 'OSMACC-1:2021 framework and controls seeded successfully'
    };

  } catch (error) {
    console.error('Error seeding OSMACC-1:2021:', error);
    throw error;
  }
};

export const removeOSMACC1 = async () => {
  try {
    const framework = await FrameworkModel.findOne({ 
      displayName: osmacc1FrameworkData.displayName 
    });

    if (framework) {
      await ControlModel.deleteMany({ frameworkId: framework._id });
      await FrameworkModel.deleteOne({ _id: framework._id });
      console.log('OSMACC-1:2021 framework and controls removed successfully');
    } else {
      console.log('OSMACC-1:2021 framework not found');
    }
  } catch (error) {
    console.error('Error removing OSMACC-1:2021:', error);
    throw error;
  }
};