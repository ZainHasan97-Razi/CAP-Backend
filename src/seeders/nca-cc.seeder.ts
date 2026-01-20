import FrameworkModel, { FrameworkTypeEnum } from '../models/framework.model';
import ControlModel from '../models/control.model';

export const ncaCcFrameworkData = {
  displayName: "NCA Cybersecurity Controls",
  type: FrameworkTypeEnum.regulatory_assessment
};

export const ncaCcControlsData = [
  // 1. Cybersecurity Governance
  {
    controlId: "CG-1.1",
    displayName: "Cybersecurity Strategy",
    groupId: "CG-1",
    groupName: "Cybersecurity Governance"
  },
  {
    controlId: "CG-1.2",
    displayName: "Cybersecurity Policy",
    groupId: "CG-1",
    groupName: "Cybersecurity Governance"
  },
  {
    controlId: "CG-1.3",
    displayName: "Cybersecurity Organizational Structure",
    groupId: "CG-1",
    groupName: "Cybersecurity Governance"
  },
  {
    controlId: "CG-1.4",
    displayName: "Cybersecurity Roles and Responsibilities",
    groupId: "CG-1",
    groupName: "Cybersecurity Governance"
  },
  {
    controlId: "CG-1.5",
    displayName: "Cybersecurity Awareness and Training",
    groupId: "CG-1",
    groupName: "Cybersecurity Governance"
  },
  {
    controlId: "CG-1.6",
    displayName: "Cybersecurity Performance Management",
    groupId: "CG-1",
    groupName: "Cybersecurity Governance"
  },

  // 2. Cybersecurity Risk Management
  {
    controlId: "RM-2.1",
    displayName: "Cybersecurity Risk Management Framework",
    groupId: "RM-2",
    groupName: "Cybersecurity Risk Management"
  },
  {
    controlId: "RM-2.2",
    displayName: "Risk Assessment",
    groupId: "RM-2",
    groupName: "Cybersecurity Risk Management"
  },
  {
    controlId: "RM-2.3",
    displayName: "Risk Treatment",
    groupId: "RM-2",
    groupName: "Cybersecurity Risk Management"
  },
  {
    controlId: "RM-2.4",
    displayName: "Risk Monitoring and Review",
    groupId: "RM-2",
    groupName: "Cybersecurity Risk Management"
  },
  {
    controlId: "RM-2.5",
    displayName: "Risk Communication and Consultation",
    groupId: "RM-2",
    groupName: "Cybersecurity Risk Management"
  },

  // 3. Asset Management
  {
    controlId: "AM-3.1",
    displayName: "Asset Inventory",
    groupId: "AM-3",
    groupName: "Asset Management"
  },
  {
    controlId: "AM-3.2",
    displayName: "Asset Classification",
    groupId: "AM-3",
    groupName: "Asset Management"
  },
  {
    controlId: "AM-3.3",
    displayName: "Asset Handling",
    groupId: "AM-3",
    groupName: "Asset Management"
  },
  {
    controlId: "AM-3.4",
    displayName: "Asset Disposal",
    groupId: "AM-3",
    groupName: "Asset Management"
  },

  // 4. Human Resources Security
  {
    controlId: "HR-4.1",
    displayName: "Personnel Screening",
    groupId: "HR-4",
    groupName: "Human Resources Security"
  },
  {
    controlId: "HR-4.2",
    displayName: "Terms and Conditions of Employment",
    groupId: "HR-4",
    groupName: "Human Resources Security"
  },
  {
    controlId: "HR-4.3",
    displayName: "Disciplinary Process",
    groupId: "HR-4",
    groupName: "Human Resources Security"
  },
  {
    controlId: "HR-4.4",
    displayName: "Termination Responsibilities",
    groupId: "HR-4",
    groupName: "Human Resources Security"
  },

  // 5. Physical and Environmental Security
  {
    controlId: "PE-5.1",
    displayName: "Physical Security Perimeters",
    groupId: "PE-5",
    groupName: "Physical and Environmental Security"
  },
  {
    controlId: "PE-5.2",
    displayName: "Physical Entry Controls",
    groupId: "PE-5",
    groupName: "Physical and Environmental Security"
  },
  {
    controlId: "PE-5.3",
    displayName: "Protection Against Environmental Threats",
    groupId: "PE-5",
    groupName: "Physical and Environmental Security"
  },
  {
    controlId: "PE-5.4",
    displayName: "Equipment Protection",
    groupId: "PE-5",
    groupName: "Physical and Environmental Security"
  },
  {
    controlId: "PE-5.5",
    displayName: "Secure Disposal or Reuse of Equipment",
    groupId: "PE-5",
    groupName: "Physical and Environmental Security"
  },

  // 6. Communications and Operations Management
  {
    controlId: "CO-6.1",
    displayName: "Operational Procedures and Responsibilities",
    groupId: "CO-6",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "CO-6.2",
    displayName: "Change Management",
    groupId: "CO-6",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "CO-6.3",
    displayName: "Capacity Management",
    groupId: "CO-6",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "CO-6.4",
    displayName: "System Acceptance",
    groupId: "CO-6",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "CO-6.5",
    displayName: "Protection Against Malicious Code",
    groupId: "CO-6",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "CO-6.6",
    displayName: "Information Backup",
    groupId: "CO-6",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "CO-6.7",
    displayName: "Network Security Management",
    groupId: "CO-6",
    groupName: "Communications and Operations Management"
  },
  {
    controlId: "CO-6.8",
    displayName: "Media Handling",
    groupId: "CO-6",
    groupName: "Communications and Operations Management"
  },

  // 7. Access Control
  {
    controlId: "AC-7.1",
    displayName: "Access Control Policy",
    groupId: "AC-7",
    groupName: "Access Control"
  },
  {
    controlId: "AC-7.2",
    displayName: "User Access Management",
    groupId: "AC-7",
    groupName: "Access Control"
  },
  {
    controlId: "AC-7.3",
    displayName: "User Responsibilities",
    groupId: "AC-7",
    groupName: "Access Control"
  },
  {
    controlId: "AC-7.4",
    displayName: "Network Access Control",
    groupId: "AC-7",
    groupName: "Access Control"
  },
  {
    controlId: "AC-7.5",
    displayName: "Operating System Access Control",
    groupId: "AC-7",
    groupName: "Access Control"
  },
  {
    controlId: "AC-7.6",
    displayName: "Application and Information Access Control",
    groupId: "AC-7",
    groupName: "Access Control"
  },
  {
    controlId: "AC-7.7",
    displayName: "Mobile Computing and Teleworking",
    groupId: "AC-7",
    groupName: "Access Control"
  },

  // 8. Information Systems Acquisition, Development and Maintenance
  {
    controlId: "SD-8.1",
    displayName: "Security Requirements of Information Systems",
    groupId: "SD-8",
    groupName: "Systems Development and Maintenance"
  },
  {
    controlId: "SD-8.2",
    displayName: "Correct Processing in Applications",
    groupId: "SD-8",
    groupName: "Systems Development and Maintenance"
  },
  {
    controlId: "SD-8.3",
    displayName: "Cryptographic Controls",
    groupId: "SD-8",
    groupName: "Systems Development and Maintenance"
  },
  {
    controlId: "SD-8.4",
    displayName: "Security of System Files",
    groupId: "SD-8",
    groupName: "Systems Development and Maintenance"
  },
  {
    controlId: "SD-8.5",
    displayName: "Security in Development and Support Processes",
    groupId: "SD-8",
    groupName: "Systems Development and Maintenance"
  },
  {
    controlId: "SD-8.6",
    displayName: "Technical Vulnerability Management",
    groupId: "SD-8",
    groupName: "Systems Development and Maintenance"
  },

  // 9. Information Security Incident Management
  {
    controlId: "IM-9.1",
    displayName: "Reporting Information Security Events and Weaknesses",
    groupId: "IM-9",
    groupName: "Information Security Incident Management"
  },
  {
    controlId: "IM-9.2",
    displayName: "Management of Information Security Incidents",
    groupId: "IM-9",
    groupName: "Information Security Incident Management"
  },
  {
    controlId: "IM-9.3",
    displayName: "Collection of Evidence",
    groupId: "IM-9",
    groupName: "Information Security Incident Management"
  },

  // 10. Business Continuity Management
  {
    controlId: "BC-10.1",
    displayName: "Including Information Security in Business Continuity Management",
    groupId: "BC-10",
    groupName: "Business Continuity Management"
  },
  {
    controlId: "BC-10.2",
    displayName: "Business Continuity and Risk Assessment",
    groupId: "BC-10",
    groupName: "Business Continuity Management"
  },
  {
    controlId: "BC-10.3",
    displayName: "Developing and Implementing Continuity Plans",
    groupId: "BC-10",
    groupName: "Business Continuity Management"
  },
  {
    controlId: "BC-10.4",
    displayName: "Business Continuity Planning Framework",
    groupId: "BC-10",
    groupName: "Business Continuity Management"
  },
  {
    controlId: "BC-10.5",
    displayName: "Testing, Maintaining and Re-assessing Business Continuity Plans",
    groupId: "BC-10",
    groupName: "Business Continuity Management"
  },

  // 11. Compliance
  {
    controlId: "CM-11.1",
    displayName: "Identification of Applicable Legislation",
    groupId: "CM-11",
    groupName: "Compliance"
  },
  {
    controlId: "CM-11.2",
    displayName: "Intellectual Property Rights",
    groupId: "CM-11",
    groupName: "Compliance"
  },
  {
    controlId: "CM-11.3",
    displayName: "Protection of Organizational Records",
    groupId: "CM-11",
    groupName: "Compliance"
  },
  {
    controlId: "CM-11.4",
    displayName: "Data Protection and Privacy of Personal Information",
    groupId: "CM-11",
    groupName: "Compliance"
  },
  {
    controlId: "CM-11.5",
    displayName: "Prevention of Misuse of Information Processing Facilities",
    groupId: "CM-11",
    groupName: "Compliance"
  },
  {
    controlId: "CM-11.6",
    displayName: "Regulation of Cryptographic Controls",
    groupId: "CM-11",
    groupName: "Compliance"
  },
  {
    controlId: "CM-11.7",
    displayName: "Information Systems Audit Considerations",
    groupId: "CM-11",
    groupName: "Compliance"
  }
];

export const seedNCACC = async () => {
  try {
    console.log('Starting NCA CC seeding...');

    const existingFramework = await FrameworkModel.findOne({ 
      displayName: ncaCcFrameworkData.displayName 
    });

    let framework;
    if (existingFramework) {
      console.log('NCA CC framework already exists, using existing one...');
      framework = existingFramework;
    } else {
      framework = await FrameworkModel.create(ncaCcFrameworkData);
      console.log('NCA CC framework created successfully');
    }

    const existingControlsCount = await ControlModel.countDocuments({ 
      frameworkId: framework._id 
    });

    if (existingControlsCount > 0) {
      console.log(`${existingControlsCount} controls already exist for NCA CC framework`);
      return {
        framework,
        controlsCreated: 0,
        message: 'Framework and controls already exist'
      };
    }

    const controlsWithFrameworkId = ncaCcControlsData.map(control => ({
      ...control,
      frameworkId: framework._id,
      frameworkName: framework.displayName
    }));

    const controls = await ControlModel.insertMany(controlsWithFrameworkId);
    
    console.log(`Successfully created ${controls.length} controls for NCA CC framework`);
    
    return {
      framework,
      controlsCreated: controls.length,
      message: 'NCA CC framework and controls seeded successfully'
    };

  } catch (error) {
    console.error('Error seeding NCA CC:', error);
    throw error;
  }
};

export const removeNCACC = async () => {
  try {
    const framework = await FrameworkModel.findOne({ 
      displayName: ncaCcFrameworkData.displayName 
    });

    if (framework) {
      await ControlModel.deleteMany({ frameworkId: framework._id });
      await FrameworkModel.deleteOne({ _id: framework._id });
      console.log('NCA CC framework and controls removed successfully');
    } else {
      console.log('NCA CC framework not found');
    }
  } catch (error) {
    console.error('Error removing NCA CC:', error);
    throw error;
  }
};