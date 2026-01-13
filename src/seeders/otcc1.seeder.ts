import FrameworkModel, { FrameworkTypeEnum } from '../models/framework.model';
import ControlModel from '../models/control.model';

export const otcc1FrameworkData = {
  displayName: "OTCC-1:2022",
  type: FrameworkTypeEnum.regulatory_assessment
};

export const otcc1ControlsData = [
  // Domain 1: OT Cybersecurity Governance
  {
    controlId: "OTCC-1.1.1",
    displayName: "OT Cybersecurity Governance Framework",
    groupId: "OTCC-1.1",
    groupName: "OT Cybersecurity Governance"
  },
  {
    controlId: "OTCC-1.1.2",
    displayName: "OT Cybersecurity Strategy",
    groupId: "OTCC-1.1",
    groupName: "OT Cybersecurity Governance"
  },
  {
    controlId: "OTCC-1.1.3",
    displayName: "OT Cybersecurity Policy",
    groupId: "OTCC-1.1",
    groupName: "OT Cybersecurity Governance"
  },
  {
    controlId: "OTCC-1.1.4",
    displayName: "OT Cybersecurity Organizational Structure",
    groupId: "OTCC-1.1",
    groupName: "OT Cybersecurity Governance"
  },
  {
    controlId: "OTCC-1.1.5",
    displayName: "OT Cybersecurity Roles and Responsibilities",
    groupId: "OTCC-1.1",
    groupName: "OT Cybersecurity Governance"
  },
  {
    controlId: "OTCC-1.1.6",
    displayName: "OT Cybersecurity Awareness and Training",
    groupId: "OTCC-1.1",
    groupName: "OT Cybersecurity Governance"
  },
  {
    controlId: "OTCC-1.1.7",
    displayName: "OT Cybersecurity Performance Management",
    groupId: "OTCC-1.1",
    groupName: "OT Cybersecurity Governance"
  },
  {
    controlId: "OTCC-1.1.8",
    displayName: "OT Cybersecurity Documentation",
    groupId: "OTCC-1.1",
    groupName: "OT Cybersecurity Governance"
  },

  // Domain 2: OT Risk Management
  {
    controlId: "OTCC-1.2.1",
    displayName: "OT Risk Management Framework",
    groupId: "OTCC-1.2",
    groupName: "OT Risk Management"
  },
  {
    controlId: "OTCC-1.2.2",
    displayName: "OT Risk Assessment",
    groupId: "OTCC-1.2",
    groupName: "OT Risk Management"
  },
  {
    controlId: "OTCC-1.2.3",
    displayName: "OT Risk Treatment",
    groupId: "OTCC-1.2",
    groupName: "OT Risk Management"
  },
  {
    controlId: "OTCC-1.2.4",
    displayName: "OT Risk Monitoring and Review",
    groupId: "OTCC-1.2",
    groupName: "OT Risk Management"
  },
  {
    controlId: "OTCC-1.2.5",
    displayName: "OT Risk Communication",
    groupId: "OTCC-1.2",
    groupName: "OT Risk Management"
  },
  {
    controlId: "OTCC-1.2.6",
    displayName: "OT Safety and Security Integration",
    groupId: "OTCC-1.2",
    groupName: "OT Risk Management"
  },

  // Domain 3: OT Asset Management
  {
    controlId: "OTCC-1.3.1",
    displayName: "OT Asset Inventory",
    groupId: "OTCC-1.3",
    groupName: "OT Asset Management"
  },
  {
    controlId: "OTCC-1.3.2",
    displayName: "OT Asset Classification",
    groupId: "OTCC-1.3",
    groupName: "OT Asset Management"
  },
  {
    controlId: "OTCC-1.3.3",
    displayName: "OT Asset Ownership",
    groupId: "OTCC-1.3",
    groupName: "OT Asset Management"
  },
  {
    controlId: "OTCC-1.3.4",
    displayName: "OT Asset Configuration Management",
    groupId: "OTCC-1.3",
    groupName: "OT Asset Management"
  },
  {
    controlId: "OTCC-1.3.5",
    displayName: "OT Asset Lifecycle Management",
    groupId: "OTCC-1.3",
    groupName: "OT Asset Management"
  },
  {
    controlId: "OTCC-1.3.6",
    displayName: "OT Asset Disposal",
    groupId: "OTCC-1.3",
    groupName: "OT Asset Management"
  },
  {
    controlId: "OTCC-1.3.7",
    displayName: "OT Asset Documentation",
    groupId: "OTCC-1.3",
    groupName: "OT Asset Management"
  },

  // Domain 4: OT Network Security
  {
    controlId: "OTCC-1.4.1",
    displayName: "OT Network Architecture",
    groupId: "OTCC-1.4",
    groupName: "OT Network Security"
  },
  {
    controlId: "OTCC-1.4.2",
    displayName: "OT Network Segmentation",
    groupId: "OTCC-1.4",
    groupName: "OT Network Security"
  },
  {
    controlId: "OTCC-1.4.3",
    displayName: "OT Network Access Control",
    groupId: "OTCC-1.4",
    groupName: "OT Network Security"
  },
  {
    controlId: "OTCC-1.4.4",
    displayName: "OT Network Monitoring",
    groupId: "OTCC-1.4",
    groupName: "OT Network Security"
  },
  {
    controlId: "OTCC-1.4.5",
    displayName: "OT Network Traffic Analysis",
    groupId: "OTCC-1.4",
    groupName: "OT Network Security"
  },
  {
    controlId: "OTCC-1.4.6",
    displayName: "OT Firewall Management",
    groupId: "OTCC-1.4",
    groupName: "OT Network Security"
  },
  {
    controlId: "OTCC-1.4.7",
    displayName: "OT Remote Access Security",
    groupId: "OTCC-1.4",
    groupName: "OT Network Security"
  },
  {
    controlId: "OTCC-1.4.8",
    displayName: "OT Wireless Security",
    groupId: "OTCC-1.4",
    groupName: "OT Network Security"
  },
  {
    controlId: "OTCC-1.4.9",
    displayName: "OT Network Redundancy",
    groupId: "OTCC-1.4",
    groupName: "OT Network Security"
  },
  {
    controlId: "OTCC-1.4.10",
    displayName: "OT Network Time Synchronization",
    groupId: "OTCC-1.4",
    groupName: "OT Network Security"
  },
  {
    controlId: "OTCC-1.4.11",
    displayName: "OT Network Documentation",
    groupId: "OTCC-1.4",
    groupName: "OT Network Security"
  },
  {
    controlId: "OTCC-1.4.12",
    displayName: "OT Network Change Management",
    groupId: "OTCC-1.4",
    groupName: "OT Network Security"
  },

  // Domain 5: OT Access Control
  {
    controlId: "OTCC-1.5.1",
    displayName: "OT Access Control Policy",
    groupId: "OTCC-1.5",
    groupName: "OT Access Control"
  },
  {
    controlId: "OTCC-1.5.2",
    displayName: "OT User Access Management",
    groupId: "OTCC-1.5",
    groupName: "OT Access Control"
  },
  {
    controlId: "OTCC-1.5.3",
    displayName: "OT Privileged Access Management",
    groupId: "OTCC-1.5",
    groupName: "OT Access Control"
  },
  {
    controlId: "OTCC-1.5.4",
    displayName: "OT Authentication and Authorization",
    groupId: "OTCC-1.5",
    groupName: "OT Access Control"
  },
  {
    controlId: "OTCC-1.5.5",
    displayName: "OT Multi-Factor Authentication",
    groupId: "OTCC-1.5",
    groupName: "OT Access Control"
  },
  {
    controlId: "OTCC-1.5.6",
    displayName: "OT Session Management",
    groupId: "OTCC-1.5",
    groupName: "OT Access Control"
  },
  {
    controlId: "OTCC-1.5.7",
    displayName: "OT Access Review and Audit",
    groupId: "OTCC-1.5",
    groupName: "OT Access Control"
  },
  {
    controlId: "OTCC-1.5.8",
    displayName: "OT Emergency Access Procedures",
    groupId: "OTCC-1.5",
    groupName: "OT Access Control"
  },
  {
    controlId: "OTCC-1.5.9",
    displayName: "OT Access Logging and Monitoring",
    groupId: "OTCC-1.5",
    groupName: "OT Access Control"
  },

  // Domain 6: OT System Security
  {
    controlId: "OTCC-1.6.1",
    displayName: "OT System Hardening",
    groupId: "OTCC-1.6",
    groupName: "OT System Security"
  },
  {
    controlId: "OTCC-1.6.2",
    displayName: "OT System Configuration Management",
    groupId: "OTCC-1.6",
    groupName: "OT System Security"
  },
  {
    controlId: "OTCC-1.6.3",
    displayName: "OT Patch Management",
    groupId: "OTCC-1.6",
    groupName: "OT System Security"
  },
  {
    controlId: "OTCC-1.6.4",
    displayName: "OT Vulnerability Management",
    groupId: "OTCC-1.6",
    groupName: "OT System Security"
  },
  {
    controlId: "OTCC-1.6.5",
    displayName: "OT Malware Protection",
    groupId: "OTCC-1.6",
    groupName: "OT System Security"
  },
  {
    controlId: "OTCC-1.6.6",
    displayName: "OT System Monitoring",
    groupId: "OTCC-1.6",
    groupName: "OT System Security"
  },
  {
    controlId: "OTCC-1.6.7",
    displayName: "OT System Backup and Recovery",
    groupId: "OTCC-1.6",
    groupName: "OT System Security"
  },
  {
    controlId: "OTCC-1.6.8",
    displayName: "OT System Testing",
    groupId: "OTCC-1.6",
    groupName: "OT System Security"
  },
  {
    controlId: "OTCC-1.6.9",
    displayName: "OT System Maintenance",
    groupId: "OTCC-1.6",
    groupName: "OT System Security"
  },
  {
    controlId: "OTCC-1.6.10",
    displayName: "OT System Decommissioning",
    groupId: "OTCC-1.6",
    groupName: "OT System Security"
  },

  // Domain 7: OT Data Protection
  {
    controlId: "OTCC-1.7.1",
    displayName: "OT Data Classification",
    groupId: "OTCC-1.7",
    groupName: "OT Data Protection"
  },
  {
    controlId: "OTCC-1.7.2",
    displayName: "OT Data Handling",
    groupId: "OTCC-1.7",
    groupName: "OT Data Protection"
  },
  {
    controlId: "OTCC-1.7.3",
    displayName: "OT Data Encryption",
    groupId: "OTCC-1.7",
    groupName: "OT Data Protection"
  },
  {
    controlId: "OTCC-1.7.4",
    displayName: "OT Data Backup and Archiving",
    groupId: "OTCC-1.7",
    groupName: "OT Data Protection"
  },
  {
    controlId: "OTCC-1.7.5",
    displayName: "OT Data Retention and Disposal",
    groupId: "OTCC-1.7",
    groupName: "OT Data Protection"
  },

  // Domain 8: OT Physical Security
  {
    controlId: "OTCC-1.8.1",
    displayName: "OT Physical Security Perimeters",
    groupId: "OTCC-1.8",
    groupName: "OT Physical Security"
  },
  {
    controlId: "OTCC-1.8.2",
    displayName: "OT Physical Access Control",
    groupId: "OTCC-1.8",
    groupName: "OT Physical Security"
  },
  {
    controlId: "OTCC-1.8.3",
    displayName: "OT Environmental Protection",
    groupId: "OTCC-1.8",
    groupName: "OT Physical Security"
  },
  {
    controlId: "OTCC-1.8.4",
    displayName: "OT Equipment Protection",
    groupId: "OTCC-1.8",
    groupName: "OT Physical Security"
  },
  {
    controlId: "OTCC-1.8.5",
    displayName: "OT Physical Security Monitoring",
    groupId: "OTCC-1.8",
    groupName: "OT Physical Security"
  },
  {
    controlId: "OTCC-1.8.6",
    displayName: "OT Maintenance Access Control",
    groupId: "OTCC-1.8",
    groupName: "OT Physical Security"
  },

  // Domain 9: OT Incident Management
  {
    controlId: "OTCC-1.9.1",
    displayName: "OT Incident Response Planning",
    groupId: "OTCC-1.9",
    groupName: "OT Incident Management"
  },
  {
    controlId: "OTCC-1.9.2",
    displayName: "OT Incident Detection and Analysis",
    groupId: "OTCC-1.9",
    groupName: "OT Incident Management"
  },
  {
    controlId: "OTCC-1.9.3",
    displayName: "OT Incident Containment and Eradication",
    groupId: "OTCC-1.9",
    groupName: "OT Incident Management"
  },
  {
    controlId: "OTCC-1.9.4",
    displayName: "OT Incident Recovery",
    groupId: "OTCC-1.9",
    groupName: "OT Incident Management"
  },
  {
    controlId: "OTCC-1.9.5",
    displayName: "OT Incident Communication",
    groupId: "OTCC-1.9",
    groupName: "OT Incident Management"
  },
  {
    controlId: "OTCC-1.9.6",
    displayName: "OT Incident Documentation",
    groupId: "OTCC-1.9",
    groupName: "OT Incident Management"
  },
  {
    controlId: "OTCC-1.9.7",
    displayName: "OT Incident Lessons Learned",
    groupId: "OTCC-1.9",
    groupName: "OT Incident Management"
  },

  // Domain 10: OT Business Continuity
  {
    controlId: "OTCC-1.10.1",
    displayName: "OT Business Continuity Planning",
    groupId: "OTCC-1.10",
    groupName: "OT Business Continuity"
  },
  {
    controlId: "OTCC-1.10.2",
    displayName: "OT Business Impact Analysis",
    groupId: "OTCC-1.10",
    groupName: "OT Business Continuity"
  },
  {
    controlId: "OTCC-1.10.3",
    displayName: "OT Disaster Recovery Planning",
    groupId: "OTCC-1.10",
    groupName: "OT Business Continuity"
  },
  {
    controlId: "OTCC-1.10.4",
    displayName: "OT Backup and Recovery Procedures",
    groupId: "OTCC-1.10",
    groupName: "OT Business Continuity"
  },
  {
    controlId: "OTCC-1.10.5",
    displayName: "OT Continuity Testing",
    groupId: "OTCC-1.10",
    groupName: "OT Business Continuity"
  },
  {
    controlId: "OTCC-1.10.6",
    displayName: "OT Emergency Response Procedures",
    groupId: "OTCC-1.10",
    groupName: "OT Business Continuity"
  },
  {
    controlId: "OTCC-1.10.7",
    displayName: "OT Alternative Processing Sites",
    groupId: "OTCC-1.10",
    groupName: "OT Business Continuity"
  },
  {
    controlId: "OTCC-1.10.8",
    displayName: "OT Continuity Plan Maintenance",
    groupId: "OTCC-1.10",
    groupName: "OT Business Continuity"
  },

  // Domain 11: OT Third Party Management
  {
    controlId: "OTCC-1.11.1",
    displayName: "OT Third Party Risk Assessment",
    groupId: "OTCC-1.11",
    groupName: "OT Third Party Management"
  },
  {
    controlId: "OTCC-1.11.2",
    displayName: "OT Vendor Management",
    groupId: "OTCC-1.11",
    groupName: "OT Third Party Management"
  },
  {
    controlId: "OTCC-1.11.3",
    displayName: "OT Supply Chain Security",
    groupId: "OTCC-1.11",
    groupName: "OT Third Party Management"
  },
  {
    controlId: "OTCC-1.11.4",
    displayName: "OT Third Party Access Control",
    groupId: "OTCC-1.11",
    groupName: "OT Third Party Management"
  },
  {
    controlId: "OTCC-1.11.5",
    displayName: "OT Third Party Monitoring",
    groupId: "OTCC-1.11",
    groupName: "OT Third Party Management"
  },

  // Domain 12: OT Compliance and Audit
  {
    controlId: "OTCC-1.12.1",
    displayName: "OT Regulatory Compliance",
    groupId: "OTCC-1.12",
    groupName: "OT Compliance and Audit"
  },
  {
    controlId: "OTCC-1.12.2",
    displayName: "OT Internal Audit",
    groupId: "OTCC-1.12",
    groupName: "OT Compliance and Audit"
  },
  {
    controlId: "OTCC-1.12.3",
    displayName: "OT External Audit",
    groupId: "OTCC-1.12",
    groupName: "OT Compliance and Audit"
  },
  {
    controlId: "OTCC-1.12.4",
    displayName: "OT Compliance Reporting",
    groupId: "OTCC-1.12",
    groupName: "OT Compliance and Audit"
  }
];

export const seedOTCC1 = async () => {
  try {
    console.log('Starting OTCC-1:2022 seeding...');

    const existingFramework = await FrameworkModel.findOne({ 
      displayName: otcc1FrameworkData.displayName 
    });

    let framework;
    if (existingFramework) {
      console.log('OTCC-1:2022 framework already exists, using existing one...');
      framework = existingFramework;
    } else {
      framework = await FrameworkModel.create(otcc1FrameworkData);
      console.log('OTCC-1:2022 framework created successfully');
    }

    const existingControlsCount = await ControlModel.countDocuments({ 
      frameworkId: framework._id 
    });

    if (existingControlsCount > 0) {
      console.log(`${existingControlsCount} controls already exist for OTCC-1:2022 framework`);
      return {
        framework,
        controlsCreated: 0,
        message: 'Framework and controls already exist'
      };
    }

    const controlsWithFrameworkId = otcc1ControlsData.map(control => ({
      ...control,
      frameworkId: framework._id
    }));

    const controls = await ControlModel.insertMany(controlsWithFrameworkId);
    
    console.log(`Successfully created ${controls.length} controls for OTCC-1:2022 framework`);
    
    return {
      framework,
      controlsCreated: controls.length,
      message: 'OTCC-1:2022 framework and controls seeded successfully'
    };

  } catch (error) {
    console.error('Error seeding OTCC-1:2022:', error);
    throw error;
  }
};

export const removeOTCC1 = async () => {
  try {
    const framework = await FrameworkModel.findOne({ 
      displayName: otcc1FrameworkData.displayName 
    });

    if (framework) {
      await ControlModel.deleteMany({ frameworkId: framework._id });
      await FrameworkModel.deleteOne({ _id: framework._id });
      console.log('OTCC-1:2022 framework and controls removed successfully');
    } else {
      console.log('OTCC-1:2022 framework not found');
    }
  } catch (error) {
    console.error('Error removing OTCC-1:2022:', error);
    throw error;
  }
};