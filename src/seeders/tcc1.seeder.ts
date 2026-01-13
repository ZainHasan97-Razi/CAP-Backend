import FrameworkModel, { FrameworkTypeEnum } from '../models/framework.model';
import ControlModel from '../models/control.model';

export const tcc1FrameworkData = {
  displayName: "TCC-1:2021",
  type: FrameworkTypeEnum.regulatory_assessment
};

export const tcc1ControlsData = [
  // Domain 1: Governance and Risk Management
  {
    controlId: "TCC-1.1.1",
    displayName: "Cybersecurity Governance Framework",
    groupId: "TCC-1.1",
    groupName: "Governance and Risk Management"
  },
  {
    controlId: "TCC-1.1.2",
    displayName: "Board and Senior Management Oversight",
    groupId: "TCC-1.1",
    groupName: "Governance and Risk Management"
  },
  {
    controlId: "TCC-1.1.3",
    displayName: "Cybersecurity Strategy and Policy",
    groupId: "TCC-1.1",
    groupName: "Governance and Risk Management"
  },
  {
    controlId: "TCC-1.1.4",
    displayName: "Risk Management Framework",
    groupId: "TCC-1.1",
    groupName: "Governance and Risk Management"
  },
  {
    controlId: "TCC-1.1.5",
    displayName: "Risk Assessment and Treatment",
    groupId: "TCC-1.1",
    groupName: "Governance and Risk Management"
  },
  {
    controlId: "TCC-1.1.6",
    displayName: "Third Party Risk Management",
    groupId: "TCC-1.1",
    groupName: "Governance and Risk Management"
  },
  {
    controlId: "TCC-1.1.7",
    displayName: "Cybersecurity Awareness and Training",
    groupId: "TCC-1.1",
    groupName: "Governance and Risk Management"
  },
  {
    controlId: "TCC-1.1.8",
    displayName: "Performance Monitoring and Reporting",
    groupId: "TCC-1.1",
    groupName: "Governance and Risk Management"
  },

  // Domain 2: Asset Management
  {
    controlId: "TCC-1.2.1",
    displayName: "Asset Inventory and Classification",
    groupId: "TCC-1.2",
    groupName: "Asset Management"
  },
  {
    controlId: "TCC-1.2.2",
    displayName: "Asset Ownership and Responsibility",
    groupId: "TCC-1.2",
    groupName: "Asset Management"
  },
  {
    controlId: "TCC-1.2.3",
    displayName: "Asset Handling and Protection",
    groupId: "TCC-1.2",
    groupName: "Asset Management"
  },
  {
    controlId: "TCC-1.2.4",
    displayName: "Asset Labeling and Handling",
    groupId: "TCC-1.2",
    groupName: "Asset Management"
  },
  {
    controlId: "TCC-1.2.5",
    displayName: "Asset Return and Disposal",
    groupId: "TCC-1.2",
    groupName: "Asset Management"
  },
  {
    controlId: "TCC-1.2.6",
    displayName: "Media Handling and Storage",
    groupId: "TCC-1.2",
    groupName: "Asset Management"
  },

  // Domain 3: Human Resources Security
  {
    controlId: "TCC-1.3.1",
    displayName: "Personnel Screening and Background Checks",
    groupId: "TCC-1.3",
    groupName: "Human Resources Security"
  },
  {
    controlId: "TCC-1.3.2",
    displayName: "Terms and Conditions of Employment",
    groupId: "TCC-1.3",
    groupName: "Human Resources Security"
  },
  {
    controlId: "TCC-1.3.3",
    displayName: "Disciplinary Process",
    groupId: "TCC-1.3",
    groupName: "Human Resources Security"
  },
  {
    controlId: "TCC-1.3.4",
    displayName: "Termination and Change of Employment",
    groupId: "TCC-1.3",
    groupName: "Human Resources Security"
  },
  {
    controlId: "TCC-1.3.5",
    displayName: "Confidentiality and Non-Disclosure Agreements",
    groupId: "TCC-1.3",
    groupName: "Human Resources Security"
  },

  // Domain 4: Physical and Environmental Security
  {
    controlId: "TCC-1.4.1",
    displayName: "Physical Security Perimeters",
    groupId: "TCC-1.4",
    groupName: "Physical and Environmental Security"
  },
  {
    controlId: "TCC-1.4.2",
    displayName: "Physical Entry Controls",
    groupId: "TCC-1.4",
    groupName: "Physical and Environmental Security"
  },
  {
    controlId: "TCC-1.4.3",
    displayName: "Protection Against Environmental Threats",
    groupId: "TCC-1.4",
    groupName: "Physical and Environmental Security"
  },
  {
    controlId: "TCC-1.4.4",
    displayName: "Working in Secure Areas",
    groupId: "TCC-1.4",
    groupName: "Physical and Environmental Security"
  },
  {
    controlId: "TCC-1.4.5",
    displayName: "Equipment Protection and Maintenance",
    groupId: "TCC-1.4",
    groupName: "Physical and Environmental Security"
  },
  {
    controlId: "TCC-1.4.6",
    displayName: "Secure Equipment Disposal",
    groupId: "TCC-1.4",
    groupName: "Physical and Environmental Security"
  },
  {
    controlId: "TCC-1.4.7",
    displayName: "Clear Desk and Clear Screen Policy",
    groupId: "TCC-1.4",
    groupName: "Physical and Environmental Security"
  },

  // Domain 5: Communications and Operations Management
  {
    controlId: "TCC-1.5.1",
    displayName: "Operational Procedures and Responsibilities",
    groupId: "TCC-1.5",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "TCC-1.5.2",
    displayName: "Change Management",
    groupId: "TCC-1.5",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "TCC-1.5.3",
    displayName: "Capacity Management",
    groupId: "TCC-1.5",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "TCC-1.5.4",
    displayName: "System Acceptance and Testing",
    groupId: "TCC-1.5",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "TCC-1.5.5",
    displayName: "Protection Against Malicious Code",
    groupId: "TCC-1.5",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "TCC-1.5.6",
    displayName: "Information Backup and Recovery",
    groupId: "TCC-1.5",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "TCC-1.5.7",
    displayName: "Network Security Management",
    groupId: "TCC-1.5",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "TCC-1.5.8",
    displayName: "Network Controls and Monitoring",
    groupId: "TCC-1.5",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "TCC-1.5.9",
    displayName: "Media Handling and Security",
    groupId: "TCC-1.5",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "TCC-1.5.10",
    displayName: "Exchange of Information",
    groupId: "TCC-1.5",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "TCC-1.5.11",
    displayName: "Electronic Commerce Services",
    groupId: "TCC-1.5",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "TCC-1.5.12",
    displayName: "Monitoring and Logging",
    groupId: "TCC-1.5",
    groupName: "Communications and Operations Management"
  },

  // Domain 6: Access Control
  {
    controlId: "TCC-1.6.1",
    displayName: "Access Control Policy",
    groupId: "TCC-1.6",
    groupName: "Access Control"
  },
  {
    controlId: "TCC-1.6.2",
    displayName: "User Access Management",
    groupId: "TCC-1.6",
    groupName: "Access Control"
  },
  {
    controlId: "TCC-1.6.3",
    displayName: "User Responsibilities",
    groupId: "TCC-1.6",
    groupName: "Access Control"
  },
  {
    controlId: "TCC-1.6.4",
    displayName: "Network Access Control",
    groupId: "TCC-1.6",
    groupName: "Access Control"
  },
  {
    controlId: "TCC-1.6.5",
    displayName: "Operating System Access Control",
    groupId: "TCC-1.6",
    groupName: "Access Control"
  },
  {
    controlId: "TCC-1.6.6",
    displayName: "Application and Information Access Control",
    groupId: "TCC-1.6",
    groupName: "Access Control"
  },
  {
    controlId: "TCC-1.6.7",
    displayName: "Mobile Computing and Teleworking",
    groupId: "TCC-1.6",
    groupName: "Access Control"
  },
  {
    controlId: "TCC-1.6.8",
    displayName: "Privileged Access Management",
    groupId: "TCC-1.6",
    groupName: "Access Control"
  },

  // Domain 7: Information Systems Acquisition, Development and Maintenance
  {
    controlId: "TCC-1.7.1",
    displayName: "Security Requirements of Information Systems",
    groupId: "TCC-1.7",
    groupName: "Systems Development and Maintenance"
  },
  {
    controlId: "TCC-1.7.2",
    displayName: "Correct Processing in Applications",
    groupId: "TCC-1.7",
    groupName: "Systems Development and Maintenance"
  },
  {
    controlId: "TCC-1.7.3",
    displayName: "Cryptographic Controls",
    groupId: "TCC-1.7",
    groupName: "Systems Development and Maintenance"
  },
  {
    controlId: "TCC-1.7.4",
    displayName: "Security of System Files",
    groupId: "TCC-1.7",
    groupName: "Systems Development and Maintenance"
  },
  {
    controlId: "TCC-1.7.5",
    displayName: "Security in Development and Support Processes",
    groupId: "TCC-1.7",
    groupName: "Systems Development and Maintenance"
  },
  {
    controlId: "TCC-1.7.6",
    displayName: "Technical Vulnerability Management",
    groupId: "TCC-1.7",
    groupName: "Systems Development and Maintenance"
  },
  {
    controlId: "TCC-1.7.7",
    displayName: "Secure System Engineering Principles",
    groupId: "TCC-1.7",
    groupName: "Systems Development and Maintenance"
  },
  {
    controlId: "TCC-1.7.8",
    displayName: "Secure Development Life Cycle",
    groupId: "TCC-1.7",
    groupName: "Systems Development and Maintenance"
  },
  {
    controlId: "TCC-1.7.9",
    displayName: "Outsourced Development",
    groupId: "TCC-1.7",
    groupName: "Systems Development and Maintenance"
  },

  // Domain 8: Information Security Incident Management
  {
    controlId: "TCC-1.8.1",
    displayName: "Reporting Information Security Events and Weaknesses",
    groupId: "TCC-1.8",
    groupName: "Information Security Incident Management"
  },
  {
    controlId: "TCC-1.8.2",
    displayName: "Management of Information Security Incidents",
    groupId: "TCC-1.8",
    groupName: "Information Security Incident Management"
  },
  {
    controlId: "TCC-1.8.3",
    displayName: "Collection of Evidence",
    groupId: "TCC-1.8",
    groupName: "Information Security Incident Management"
  },
  {
    controlId: "TCC-1.8.4",
    displayName: "Learning from Information Security Incidents",
    groupId: "TCC-1.8",
    groupName: "Information Security Incident Management"
  },

  // Domain 9: Business Continuity Management
  {
    controlId: "TCC-1.9.1",
    displayName: "Including Information Security in Business Continuity Management",
    groupId: "TCC-1.9",
    groupName: "Business Continuity Management"
  },
  {
    controlId: "TCC-1.9.2",
    displayName: "Business Continuity and Risk Assessment",
    groupId: "TCC-1.9",
    groupName: "Business Continuity Management"
  },
  {
    controlId: "TCC-1.9.3",
    displayName: "Developing and Implementing Continuity Plans",
    groupId: "TCC-1.9",
    groupName: "Business Continuity Management"
  },
  {
    controlId: "TCC-1.9.4",
    displayName: "Business Continuity Planning Framework",
    groupId: "TCC-1.9",
    groupName: "Business Continuity Management"
  },
  {
    controlId: "TCC-1.9.5",
    displayName: "Testing, Maintaining and Re-assessing Business Continuity Plans",
    groupId: "TCC-1.9",
    groupName: "Business Continuity Management"
  },
  {
    controlId: "TCC-1.9.6",
    displayName: "Telecommunications Service Continuity",
    groupId: "TCC-1.9",
    groupName: "Business Continuity Management"
  },

  // Domain 10: Compliance
  {
    controlId: "TCC-1.10.1",
    displayName: "Identification of Applicable Legislation and Regulatory Requirements",
    groupId: "TCC-1.10",
    groupName: "Compliance"
  },
  {
    controlId: "TCC-1.10.2",
    displayName: "Intellectual Property Rights",
    groupId: "TCC-1.10",
    groupName: "Compliance"
  },
  {
    controlId: "TCC-1.10.3",
    displayName: "Protection of Organizational Records",
    groupId: "TCC-1.10",
    groupName: "Compliance"
  },
  {
    controlId: "TCC-1.10.4",
    displayName: "Data Protection and Privacy of Personal Information",
    groupId: "TCC-1.10",
    groupName: "Compliance"
  },
  {
    controlId: "TCC-1.10.5",
    displayName: "Information Systems Audit Considerations",
    groupId: "TCC-1.10",
    groupName: "Compliance"
  }
];

export const seedTCC1 = async () => {
  try {
    console.log('Starting TCC-1:2021 seeding...');

    const existingFramework = await FrameworkModel.findOne({ 
      displayName: tcc1FrameworkData.displayName 
    });

    let framework;
    if (existingFramework) {
      console.log('TCC-1:2021 framework already exists, using existing one...');
      framework = existingFramework;
    } else {
      framework = await FrameworkModel.create(tcc1FrameworkData);
      console.log('TCC-1:2021 framework created successfully');
    }

    const existingControlsCount = await ControlModel.countDocuments({ 
      frameworkId: framework._id 
    });

    if (existingControlsCount > 0) {
      console.log(`${existingControlsCount} controls already exist for TCC-1:2021 framework`);
      return {
        framework,
        controlsCreated: 0,
        message: 'Framework and controls already exist'
      };
    }

    const controlsWithFrameworkId = tcc1ControlsData.map(control => ({
      ...control,
      frameworkId: framework._id
    }));

    const controls = await ControlModel.insertMany(controlsWithFrameworkId);
    
    console.log(`Successfully created ${controls.length} controls for TCC-1:2021 framework`);
    
    return {
      framework,
      controlsCreated: controls.length,
      message: 'TCC-1:2021 framework and controls seeded successfully'
    };

  } catch (error) {
    console.error('Error seeding TCC-1:2021:', error);
    throw error;
  }
};

export const removeTCC1 = async () => {
  try {
    const framework = await FrameworkModel.findOne({ 
      displayName: tcc1FrameworkData.displayName 
    });

    if (framework) {
      await ControlModel.deleteMany({ frameworkId: framework._id });
      await FrameworkModel.deleteOne({ _id: framework._id });
      console.log('TCC-1:2021 framework and controls removed successfully');
    } else {
      console.log('TCC-1:2021 framework not found');
    }
  } catch (error) {
    console.error('Error removing TCC-1:2021:', error);
    throw error;
  }
};