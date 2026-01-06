import FrameworkModel, { FrameworkTypeEnum } from '../models/framework.model';
import ControlModel from '../models/control.model';

export const samaCsfFrameworkData = {
  displayName: "SAMA Cyber Security Framework",
  type: FrameworkTypeEnum.regulatory_assessment
};

export const samaCsfControlsData = [
  // Domain 1: Cybersecurity Governance
  {
    controlId: "CG-1.1",
    displayName: "Board Oversight",
    groupId: "CG-1",
    groupName: "Cybersecurity Governance"
  },
  {
    controlId: "CG-1.2",
    displayName: "Cybersecurity Strategy",
    groupId: "CG-1",
    groupName: "Cybersecurity Governance"
  },
  {
    controlId: "CG-1.3",
    displayName: "Organizational Structure",
    groupId: "CG-1",
    groupName: "Cybersecurity Governance"
  },
  {
    controlId: "CG-1.4",
    displayName: "Cybersecurity Policy",
    groupId: "CG-1",
    groupName: "Cybersecurity Governance"
  },
  {
    controlId: "CG-1.5",
    displayName: "Risk Management Framework",
    groupId: "CG-1",
    groupName: "Cybersecurity Governance"
  },

  // Domain 2: Cybersecurity Defense - Asset Management
  {
    controlId: "CD-2.1",
    displayName: "Asset Inventory",
    groupId: "CD-2",
    groupName: "Asset Management"
  },
  {
    controlId: "CD-2.2",
    displayName: "Asset Classification",
    groupId: "CD-2",
    groupName: "Asset Management"
  },
  {
    controlId: "CD-2.3",
    displayName: "Asset Handling",
    groupId: "CD-2",
    groupName: "Asset Management"
  },

  // Domain 2: Cybersecurity Defense - Access Control
  {
    controlId: "CD-3.1",
    displayName: "Access Control Policy",
    groupId: "CD-3",
    groupName: "Access Control"
  },
  {
    controlId: "CD-3.2",
    displayName: "User Access Management",
    groupId: "CD-3",
    groupName: "Access Control"
  },
  {
    controlId: "CD-3.3",
    displayName: "Privileged Access Management",
    groupId: "CD-3",
    groupName: "Access Control"
  },
  {
    controlId: "CD-3.4",
    displayName: "Authentication",
    groupId: "CD-3",
    groupName: "Access Control"
  },

  // Domain 2: Cybersecurity Defense - Data Protection
  {
    controlId: "CD-4.1",
    displayName: "Data Classification",
    groupId: "CD-4",
    groupName: "Data Protection"
  },
  {
    controlId: "CD-4.2",
    displayName: "Data Handling",
    groupId: "CD-4",
    groupName: "Data Protection"
  },
  {
    controlId: "CD-4.3",
    displayName: "Data Loss Prevention",
    groupId: "CD-4",
    groupName: "Data Protection"
  },
  {
    controlId: "CD-4.4",
    displayName: "Cryptography",
    groupId: "CD-4",
    groupName: "Data Protection"
  },

  // Domain 2: Cybersecurity Defense - Network Security
  {
    controlId: "CD-5.1",
    displayName: "Network Architecture",
    groupId: "CD-5",
    groupName: "Network Security"
  },
  {
    controlId: "CD-5.2",
    displayName: "Network Monitoring",
    groupId: "CD-5",
    groupName: "Network Security"
  },
  {
    controlId: "CD-5.3",
    displayName: "Network Access Control",
    groupId: "CD-5",
    groupName: "Network Security"
  },

  // Domain 2: Cybersecurity Defense - Systems Security
  {
    controlId: "CD-6.1",
    displayName: "Endpoint Protection",
    groupId: "CD-6",
    groupName: "Systems Security"
  },
  {
    controlId: "CD-6.2",
    displayName: "System Hardening",
    groupId: "CD-6",
    groupName: "Systems Security"
  },
  {
    controlId: "CD-6.3",
    displayName: "Vulnerability Management",
    groupId: "CD-6",
    groupName: "Systems Security"
  },
  {
    controlId: "CD-6.4",
    displayName: "Patch Management",
    groupId: "CD-6",
    groupName: "Systems Security"
  },

  // Domain 2: Cybersecurity Defense - Application Security
  {
    controlId: "CD-7.1",
    displayName: "Secure Development",
    groupId: "CD-7",
    groupName: "Application Security"
  },
  {
    controlId: "CD-7.2",
    displayName: "Application Testing",
    groupId: "CD-7",
    groupName: "Application Security"
  },
  {
    controlId: "CD-7.3",
    displayName: "Application Deployment",
    groupId: "CD-7",
    groupName: "Application Security"
  },

  // Domain 3: Cybersecurity Resilience - Business Continuity
  {
    controlId: "CR-8.1",
    displayName: "Business Continuity Planning",
    groupId: "CR-8",
    groupName: "Business Continuity"
  },
  {
    controlId: "CR-8.2",
    displayName: "Backup and Recovery",
    groupId: "CR-8",
    groupName: "Business Continuity"
  },
  {
    controlId: "CR-8.3",
    displayName: "Disaster Recovery",
    groupId: "CR-8",
    groupName: "Business Continuity"
  },
  {
    controlId: "CR-8.4",
    displayName: "Testing and Validation",
    groupId: "CR-8",
    groupName: "Business Continuity"
  },

  // Domain 4: Dealing with Cybersecurity Events - Incident Response
  {
    controlId: "CE-9.1",
    displayName: "Incident Response Planning",
    groupId: "CE-9",
    groupName: "Incident Response"
  },
  {
    controlId: "CE-9.2",
    displayName: "Incident Detection",
    groupId: "CE-9",
    groupName: "Incident Response"
  },
  {
    controlId: "CE-9.3",
    displayName: "Incident Analysis",
    groupId: "CE-9",
    groupName: "Incident Response"
  },
  {
    controlId: "CE-9.4",
    displayName: "Incident Containment",
    groupId: "CE-9",
    groupName: "Incident Response"
  },
  {
    controlId: "CE-9.5",
    displayName: "Incident Recovery",
    groupId: "CE-9",
    groupName: "Incident Response"
  },
  {
    controlId: "CE-9.6",
    displayName: "Incident Communication",
    groupId: "CE-9",
    groupName: "Incident Response"
  },

  // Domain 4: Dealing with Cybersecurity Events - Monitoring
  {
    controlId: "CE-10.1",
    displayName: "Security Monitoring",
    groupId: "CE-10",
    groupName: "Security Monitoring"
  },
  {
    controlId: "CE-10.2",
    displayName: "Log Management",
    groupId: "CE-10",
    groupName: "Security Monitoring"
  },
  {
    controlId: "CE-10.3",
    displayName: "Threat Intelligence",
    groupId: "CE-10",
    groupName: "Security Monitoring"
  },

  // Domain 5: Third Party Cybersecurity Risk Management
  {
    controlId: "TP-11.1",
    displayName: "Third Party Risk Assessment",
    groupId: "TP-11",
    groupName: "Third Party Risk Management"
  },
  {
    controlId: "TP-11.2",
    displayName: "Vendor Management",
    groupId: "TP-11",
    groupName: "Third Party Risk Management"
  },
  {
    controlId: "TP-11.3",
    displayName: "Contractual Requirements",
    groupId: "TP-11",
    groupName: "Third Party Risk Management"
  },
  {
    controlId: "TP-11.4",
    displayName: "Third Party Monitoring",
    groupId: "TP-11",
    groupName: "Third Party Risk Management"
  },
  {
    controlId: "TP-11.5",
    displayName: "Supply Chain Security",
    groupId: "TP-11",
    groupName: "Third Party Risk Management"
  }
];

export const seedSamaCSF = async () => {
  try {
    console.log('Starting SAMA CSF seeding...');

    // Check if framework already exists
    const existingFramework = await FrameworkModel.findOne({ 
      displayName: samaCsfFrameworkData.displayName 
    });

    let framework;
    if (existingFramework) {
      console.log('SAMA CSF framework already exists, using existing one...');
      framework = existingFramework;
    } else {
      // Create framework
      framework = await FrameworkModel.create(samaCsfFrameworkData);
      console.log('SAMA CSF framework created successfully');
    }

    // Check if controls already exist for this framework
    const existingControlsCount = await ControlModel.countDocuments({ 
      frameworkId: framework._id 
    });

    if (existingControlsCount > 0) {
      console.log(`${existingControlsCount} controls already exist for SAMA CSF framework`);
      return {
        framework,
        controlsCreated: 0,
        message: 'Framework and controls already exist'
      };
    }

    // Create controls with framework reference
    const controlsWithFrameworkId = samaCsfControlsData.map(control => ({
      ...control,
      frameworkId: framework._id
    }));

    const controls = await ControlModel.insertMany(controlsWithFrameworkId);
    
    console.log(`Successfully created ${controls.length} controls for SAMA CSF framework`);
    
    return {
      framework,
      controlsCreated: controls.length,
      message: 'SAMA CSF framework and controls seeded successfully'
    };

  } catch (error) {
    console.error('Error seeding SAMA CSF:', error);
    throw error;
  }
};

// Function to remove SAMA CSF data (for cleanup/reset)
export const removeSamaCSF = async () => {
  try {
    const framework = await FrameworkModel.findOne({ 
      displayName: samaCsfFrameworkData.displayName 
    });

    if (framework) {
      await ControlModel.deleteMany({ frameworkId: framework._id });
      await FrameworkModel.deleteOne({ _id: framework._id });
      console.log('SAMA CSF framework and controls removed successfully');
    } else {
      console.log('SAMA CSF framework not found');
    }
  } catch (error) {
    console.error('Error removing SAMA CSF:', error);
    throw error;
  }
};