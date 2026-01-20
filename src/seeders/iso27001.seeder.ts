import FrameworkModel, { FrameworkTypeEnum } from '../models/framework.model';
import ControlModel from '../models/control.model';

export const iso27001FrameworkData = {
  displayName: "ISO 27001:2022",
  type: FrameworkTypeEnum.international_standards
};

export const iso27001ControlsData = [
  // A.5 Organizational controls
  {
    controlId: "A.5.1",
    displayName: "Policies for information security",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.2",
    displayName: "Information security roles and responsibilities",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.3",
    displayName: "Segregation of duties",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.4",
    displayName: "Management responsibilities",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.5",
    displayName: "Contact with authorities",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.6",
    displayName: "Contact with special interest groups",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.7",
    displayName: "Threat intelligence",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.8",
    displayName: "Information security in project management",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.9",
    displayName: "Inventory of information and other associated assets",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.10",
    displayName: "Acceptable use of information and other associated assets",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.11",
    displayName: "Return of assets",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.12",
    displayName: "Classification of information",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.13",
    displayName: "Labelling of information",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.14",
    displayName: "Information transfer",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.15",
    displayName: "Access control",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.16",
    displayName: "Identity management",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.17",
    displayName: "Authentication information",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.18",
    displayName: "Access rights",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.19",
    displayName: "Information security in supplier relationships",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.20",
    displayName: "Addressing information security within supplier agreements",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.21",
    displayName: "Managing information security in the ICT supply chain",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.22",
    displayName: "Monitoring, review and change management of supplier services",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.23",
    displayName: "Information security for use of cloud services",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.24",
    displayName: "Information security incident management planning and preparation",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.25",
    displayName: "Assessment and decision on information security events",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.26",
    displayName: "Response to information security incidents",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.27",
    displayName: "Learning from information security incidents",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.28",
    displayName: "Collection of evidence",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.29",
    displayName: "Information security during disruption",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.30",
    displayName: "ICT readiness for business continuity",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.31",
    displayName: "Legal, statutory, regulatory and contractual requirements",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.32",
    displayName: "Intellectual property rights",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.33",
    displayName: "Protection of records",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.34",
    displayName: "Privacy and protection of PII",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.35",
    displayName: "Independent review of information security",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.36",
    displayName: "Compliance with policies, rules and standards for information security",
    groupId: "A.5",
    groupName: "Organizational controls"
  },
  {
    controlId: "A.5.37",
    displayName: "Documented operating procedures",
    groupId: "A.5",
    groupName: "Organizational controls"
  },

  // A.6 People controls
  {
    controlId: "A.6.1",
    displayName: "Screening",
    groupId: "A.6",
    groupName: "People controls"
  },
  {
    controlId: "A.6.2",
    displayName: "Terms and conditions of employment",
    groupId: "A.6",
    groupName: "People controls"
  },
  {
    controlId: "A.6.3",
    displayName: "Information security awareness, education and training",
    groupId: "A.6",
    groupName: "People controls"
  },
  {
    controlId: "A.6.4",
    displayName: "Disciplinary process",
    groupId: "A.6",
    groupName: "People controls"
  },
  {
    controlId: "A.6.5",
    displayName: "Information security responsibilities after termination or change of employment",
    groupId: "A.6",
    groupName: "People controls"
  },
  {
    controlId: "A.6.6",
    displayName: "Confidentiality or non-disclosure agreements",
    groupId: "A.6",
    groupName: "People controls"
  },
  {
    controlId: "A.6.7",
    displayName: "Remote working",
    groupId: "A.6",
    groupName: "People controls"
  },
  {
    controlId: "A.6.8",
    displayName: "Information security event reporting",
    groupId: "A.6",
    groupName: "People controls"
  },

  // A.7 Physical controls
  {
    controlId: "A.7.1",
    displayName: "Physical security perimeters",
    groupId: "A.7",
    groupName: "Physical controls"
  },
  {
    controlId: "A.7.2",
    displayName: "Physical entry",
    groupId: "A.7",
    groupName: "Physical controls"
  },
  {
    controlId: "A.7.3",
    displayName: "Protection against environmental threats",
    groupId: "A.7",
    groupName: "Physical controls"
  },
  {
    controlId: "A.7.4",
    displayName: "Working in secure areas",
    groupId: "A.7",
    groupName: "Physical controls"
  },
  {
    controlId: "A.7.5",
    displayName: "Secure disposal or reuse of equipment",
    groupId: "A.7",
    groupName: "Physical controls"
  },
  {
    controlId: "A.7.6",
    displayName: "Clear desk and clear screen",
    groupId: "A.7",
    groupName: "Physical controls"
  },
  {
    controlId: "A.7.7",
    displayName: "Equipment siting and protection",
    groupId: "A.7",
    groupName: "Physical controls"
  },
  {
    controlId: "A.7.8",
    displayName: "Equipment maintenance",
    groupId: "A.7",
    groupName: "Physical controls"
  },
  {
    controlId: "A.7.9",
    displayName: "Secure disposal or reuse of storage media",
    groupId: "A.7",
    groupName: "Physical controls"
  },
  {
    controlId: "A.7.10",
    displayName: "Storage media",
    groupId: "A.7",
    groupName: "Physical controls"
  },
  {
    controlId: "A.7.11",
    displayName: "Supporting utilities",
    groupId: "A.7",
    groupName: "Physical controls"
  },
  {
    controlId: "A.7.12",
    displayName: "Cabling security",
    groupId: "A.7",
    groupName: "Physical controls"
  },
  {
    controlId: "A.7.13",
    displayName: "Equipment maintenance",
    groupId: "A.7",
    groupName: "Physical controls"
  },
  {
    controlId: "A.7.14",
    displayName: "Secure disposal or reuse of equipment",
    groupId: "A.7",
    groupName: "Physical controls"
  },

  // A.8 Technological controls
  {
    controlId: "A.8.1",
    displayName: "User endpoint devices",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.2",
    displayName: "Privileged access rights",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.3",
    displayName: "Information access restriction",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.4",
    displayName: "Access to source code",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.5",
    displayName: "Secure authentication",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.6",
    displayName: "Capacity management",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.7",
    displayName: "Protection against malware",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.8",
    displayName: "Management of technical vulnerabilities",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.9",
    displayName: "Configuration management",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.10",
    displayName: "Information deletion",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.11",
    displayName: "Data masking",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.12",
    displayName: "Data leakage prevention",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.13",
    displayName: "Information backup",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.14",
    displayName: "Redundancy of information processing facilities",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.15",
    displayName: "Logging",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.16",
    displayName: "Monitoring activities",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.17",
    displayName: "Clock synchronisation",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.18",
    displayName: "Use of privileged utility programs",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.19",
    displayName: "Installation of software on operational systems",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.20",
    displayName: "Networks security management",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.21",
    displayName: "Security of network services",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.22",
    displayName: "Segregation of networks",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.23",
    displayName: "Web filtering",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.24",
    displayName: "Use of cryptography",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.25",
    displayName: "Secure system development life cycle",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.26",
    displayName: "Application security requirements",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.27",
    displayName: "Secure system architecture and engineering principles",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.28",
    displayName: "Secure coding",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.29",
    displayName: "Security testing in development and acceptance",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.30",
    displayName: "Outsourced development",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.31",
    displayName: "Separation of development, test and production environments",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.32",
    displayName: "Change management",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.33",
    displayName: "Test information",
    groupId: "A.8",
    groupName: "Technological controls"
  },
  {
    controlId: "A.8.34",
    displayName: "Protection of information systems during audit testing",
    groupId: "A.8",
    groupName: "Technological controls"
  }
];

export const seedISO27001 = async () => {
  try {
    console.log('Starting ISO 27001 seeding...');

    // Check if framework already exists
    const existingFramework = await FrameworkModel.findOne({ 
      displayName: iso27001FrameworkData.displayName 
    });

    let framework;
    if (existingFramework) {
      console.log('ISO 27001 framework already exists, using existing one...');
      framework = existingFramework;
    } else {
      // Create framework
      framework = await FrameworkModel.create(iso27001FrameworkData);
      console.log('ISO 27001 framework created successfully');
    }

    // Check if controls already exist for this framework
    const existingControlsCount = await ControlModel.countDocuments({ 
      frameworkId: framework._id,
      frameworkName: framework.displayName
    });

    if (existingControlsCount > 0) {
      console.log(`${existingControlsCount} controls already exist for ISO 27001 framework`);
      return {
        framework,
        controlsCreated: 0,
        message: 'Framework and controls already exist'
      };
    }

    // Create controls with framework reference
    const controlsWithFrameworkId = iso27001ControlsData.map(control => ({
      ...control,
      frameworkId: framework._id,
      frameworkName: framework.displayName
    }));

    const controls = await ControlModel.insertMany(controlsWithFrameworkId);
    
    console.log(`Successfully created ${controls.length} controls for ISO 27001 framework`);
    
    return {
      framework,
      controlsCreated: controls.length,
      message: 'ISO 27001 framework and controls seeded successfully'
    };

  } catch (error) {
    console.error('Error seeding ISO 27001:', error);
    throw error;
  }
};

// Function to remove ISO 27001 data (for cleanup/reset)
export const removeISO27001 = async () => {
  try {
    const framework = await FrameworkModel.findOne({ 
      displayName: iso27001FrameworkData.displayName 
    });

    if (framework) {
      await ControlModel.deleteMany({ frameworkId: framework._id });
      await FrameworkModel.deleteOne({ _id: framework._id });
      console.log('ISO 27001 framework and controls removed successfully');
    } else {
      console.log('ISO 27001 framework not found');
    }
  } catch (error) {
    console.error('Error removing ISO 27001:', error);
    throw error;
  }
};