import FrameworkModel, { FrameworkTypeEnum } from '../models/framework.model';
import ControlModel from '../models/control.model';

export const samaCsfFrameworkData = {
  displayName: "SAMA Cyber Security Framework",
  type: FrameworkTypeEnum.regulatory_assessment
};

export const samaCsfControlsData = [
  // 3.1 Cyber Security Governance
  {
    controlId: "3.1.1",
    displayName: "Cyber Security Governance",
    groupId: "3.1",
    groupName: "Cyber Security Governance"
  },
  {
    controlId: "3.1.2",
    displayName: "Cyber Security Strategy",
    groupId: "3.1",
    groupName: "Cyber Security Governance"
  },
  {
    controlId: "3.1.3",
    displayName: "Cyber Security Policy",
    groupId: "3.1",
    groupName: "Cyber Security Governance"
  },
  {
    controlId: "3.1.4",
    displayName: "Cyber Security Roles and Responsibilities",
    groupId: "3.1",
    groupName: "Cyber Security Governance"
  },
  {
    controlId: "3.1.5",
    displayName: "Cyber Security in Project Management",
    groupId: "3.1",
    groupName: "Cyber Security Governance"
  },
  {
    controlId: "3.1.6",
    displayName: "Cyber Security Awareness",
    groupId: "3.1",
    groupName: "Cyber Security Governance"
  },
  {
    controlId: "3.1.7",
    displayName: "Cyber Security Training",
    groupId: "3.1",
    groupName: "Cyber Security Governance"
  },

  // 3.2 Cyber Security Risk Management and Compliance
  {
    controlId: "3.2.1",
    displayName: "Cyber Security Risk Management",
    groupId: "3.2",
    groupName: "Cyber Security Risk Management and Compliance"
  },
  {
    controlId: "3.2.2",
    displayName: "Regulatory Compliance",
    groupId: "3.2",
    groupName: "Cyber Security Risk Management and Compliance"
  },
  {
    controlId: "3.2.3",
    displayName: "Compliance with (inter)national industry standards",
    groupId: "3.2",
    groupName: "Cyber Security Risk Management and Compliance"
  },
  {
    controlId: "3.2.4",
    displayName: "Cyber Security Review",
    groupId: "3.2",
    groupName: "Cyber Security Risk Management and Compliance"
  },
  {
    controlId: "3.2.5",
    displayName: "Cyber Security Audits",
    groupId: "3.2",
    groupName: "Cyber Security Risk Management and Compliance"
  },

  // 3.3 Cyber Security Operations and Technology
  {
    controlId: "3.3.1",
    displayName: "Human Resources",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.2",
    displayName: "Physical Security",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.3",
    displayName: "Asset Management",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.4",
    displayName: "Cyber Security Architecture",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.5",
    displayName: "Identity and Access Management",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.6",
    displayName: "Application Security",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.7",
    displayName: "Change Management",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.8",
    displayName: "Infrastructure Security",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.9",
    displayName: "Cryptography",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.10",
    displayName: "Bring Your Own Device (BYOD)",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.11",
    displayName: "Secure Disposal of Information Assets",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.12",
    displayName: "Payment Systems",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.13",
    displayName: "Electronic Banking Services",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.14",
    displayName: "Cyber Security Event Management",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.15",
    displayName: "Cyber Security Incident Management",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.16",
    displayName: "Threat Management",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },
  {
    controlId: "3.3.17",
    displayName: "Vulnerability Management",
    groupId: "3.3",
    groupName: "Cyber Security Operations and Technology"
  },

  // 3.4 Third Party Cyber Security
  {
    controlId: "3.4.1",
    displayName: "Contract and Vendor Management",
    groupId: "3.4",
    groupName: "Third Party Cyber Security"
  },
  {
    controlId: "3.4.2",
    displayName: "Outsourcing",
    groupId: "3.4",
    groupName: "Third Party Cyber Security"
  },
  {
    controlId: "3.4.3",
    displayName: "Cloud Computing",
    groupId: "3.4",
    groupName: "Third Party Cyber Security"
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
      frameworkId: framework._id,
      frameworkName: framework.displayName
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