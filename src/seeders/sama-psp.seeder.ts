import FrameworkModel, { FrameworkTypeEnum } from '../models/framework.model';
import ControlModel from '../models/control.model';

export const samaPspFrameworkData = {
  displayName: "SAMA Payment Systems Policy",
  type: FrameworkTypeEnum.regulatory_assessment
};

export const samaPspControlsData = [
  // 1. Governance and Management
  {
    controlId: "GM-1.1",
    displayName: "Payment System Governance Framework",
    groupId: "GM-1",
    groupName: "Governance and Management"
  },
  {
    controlId: "GM-1.2",
    displayName: "Board and Senior Management Oversight",
    groupId: "GM-1",
    groupName: "Governance and Management"
  },
  {
    controlId: "GM-1.3",
    displayName: "Payment System Strategy",
    groupId: "GM-1",
    groupName: "Governance and Management"
  },
  {
    controlId: "GM-1.4",
    displayName: "Organizational Structure",
    groupId: "GM-1",
    groupName: "Governance and Management"
  },
  {
    controlId: "GM-1.5",
    displayName: "Roles and Responsibilities",
    groupId: "GM-1",
    groupName: "Governance and Management"
  },

  // 2. Risk Management
  {
    controlId: "RM-2.1",
    displayName: "Risk Management Framework",
    groupId: "RM-2",
    groupName: "Risk Management"
  },
  {
    controlId: "RM-2.2",
    displayName: "Credit Risk Management",
    groupId: "RM-2",
    groupName: "Risk Management"
  },
  {
    controlId: "RM-2.3",
    displayName: "Liquidity Risk Management",
    groupId: "RM-2",
    groupName: "Risk Management"
  },
  {
    controlId: "RM-2.4",
    displayName: "Operational Risk Management",
    groupId: "RM-2",
    groupName: "Risk Management"
  },
  {
    controlId: "RM-2.5",
    displayName: "Legal Risk Management",
    groupId: "RM-2",
    groupName: "Risk Management"
  },
  {
    controlId: "RM-2.6",
    displayName: "Settlement Risk Management",
    groupId: "RM-2",
    groupName: "Risk Management"
  },

  // 3. Financial Risk and Settlement
  {
    controlId: "FS-3.1",
    displayName: "Settlement Finality",
    groupId: "FS-3",
    groupName: "Financial Risk and Settlement"
  },
  {
    controlId: "FS-3.2",
    displayName: "Settlement Asset",
    groupId: "FS-3",
    groupName: "Financial Risk and Settlement"
  },
  {
    controlId: "FS-3.3",
    displayName: "Settlement Cycles",
    groupId: "FS-3",
    groupName: "Financial Risk and Settlement"
  },
  {
    controlId: "FS-3.4",
    displayName: "Central Bank Money",
    groupId: "FS-3",
    groupName: "Financial Risk and Settlement"
  },
  {
    controlId: "FS-3.5",
    displayName: "Collateral",
    groupId: "FS-3",
    groupName: "Financial Risk and Settlement"
  },

  // 4. Operational Reliability
  {
    controlId: "OR-4.1",
    displayName: "Operational Performance",
    groupId: "OR-4",
    groupName: "Operational Reliability"
  },
  {
    controlId: "OR-4.2",
    displayName: "Scalability",
    groupId: "OR-4",
    groupName: "Operational Reliability"
  },
  {
    controlId: "OR-4.3",
    displayName: "System Availability",
    groupId: "OR-4",
    groupName: "Operational Reliability"
  },
  {
    controlId: "OR-4.4",
    displayName: "Disaster Recovery",
    groupId: "OR-4",
    groupName: "Operational Reliability"
  },
  {
    controlId: "OR-4.5",
    displayName: "Business Continuity Planning",
    groupId: "OR-4",
    groupName: "Operational Reliability"
  },

  // 5. Access and Participation
  {
    controlId: "AP-5.1",
    displayName: "Participation Criteria",
    groupId: "AP-5",
    groupName: "Access and Participation"
  },
  {
    controlId: "AP-5.2",
    displayName: "Tiered Participation",
    groupId: "AP-5",
    groupName: "Access and Participation"
  },
  {
    controlId: "AP-5.3",
    displayName: "Participant Default Procedures",
    groupId: "AP-5",
    groupName: "Access and Participation"
  },
  {
    controlId: "AP-5.4",
    displayName: "Segregation and Portability",
    groupId: "AP-5",
    groupName: "Access and Participation"
  },

  // 6. Efficiency and Effectiveness
  {
    controlId: "EE-6.1",
    displayName: "Design and Procedures",
    groupId: "EE-6",
    groupName: "Efficiency and Effectiveness"
  },
  {
    controlId: "EE-6.2",
    displayName: "Communication Procedures",
    groupId: "EE-6",
    groupName: "Efficiency and Effectiveness"
  },
  {
    controlId: "EE-6.3",
    displayName: "Transaction Processing",
    groupId: "EE-6",
    groupName: "Efficiency and Effectiveness"
  },
  {
    controlId: "EE-6.4",
    displayName: "Cost Structure",
    groupId: "EE-6",
    groupName: "Efficiency and Effectiveness"
  },

  // 7. Transparency
  {
    controlId: "TR-7.1",
    displayName: "Disclosure of Rules and Procedures",
    groupId: "TR-7",
    groupName: "Transparency"
  },
  {
    controlId: "TR-7.2",
    displayName: "Disclosure of Market Data",
    groupId: "TR-7",
    groupName: "Transparency"
  },
  {
    controlId: "TR-7.3",
    displayName: "Disclosure of System Performance",
    groupId: "TR-7",
    groupName: "Transparency"
  },

  // 8. Information Security
  {
    controlId: "IS-8.1",
    displayName: "Information Security Framework",
    groupId: "IS-8",
    groupName: "Information Security"
  },
  {
    controlId: "IS-8.2",
    displayName: "Access Controls",
    groupId: "IS-8",
    groupName: "Information Security"
  },
  {
    controlId: "IS-8.3",
    displayName: "Data Protection",
    groupId: "IS-8",
    groupName: "Information Security"
  },
  {
    controlId: "IS-8.4",
    displayName: "Cryptographic Controls",
    groupId: "IS-8",
    groupName: "Information Security"
  },
  {
    controlId: "IS-8.5",
    displayName: "Network Security",
    groupId: "IS-8",
    groupName: "Information Security"
  },
  {
    controlId: "IS-8.6",
    displayName: "Incident Management",
    groupId: "IS-8",
    groupName: "Information Security"
  },

  // 9. Change Management
  {
    controlId: "CM-9.1",
    displayName: "Change Management Framework",
    groupId: "CM-9",
    groupName: "Change Management"
  },
  {
    controlId: "CM-9.2",
    displayName: "System Changes",
    groupId: "CM-9",
    groupName: "Change Management"
  },
  {
    controlId: "CM-9.3",
    displayName: "Testing Procedures",
    groupId: "CM-9",
    groupName: "Change Management"
  },
  {
    controlId: "CM-9.4",
    displayName: "Implementation and Rollback",
    groupId: "CM-9",
    groupName: "Change Management"
  },

  // 10. Outsourcing and Third Party Management
  {
    controlId: "TP-10.1",
    displayName: "Third Party Risk Assessment",
    groupId: "TP-10",
    groupName: "Third Party Management"
  },
  {
    controlId: "TP-10.2",
    displayName: "Outsourcing Arrangements",
    groupId: "TP-10",
    groupName: "Third Party Management"
  },
  {
    controlId: "TP-10.3",
    displayName: "Service Level Agreements",
    groupId: "TP-10",
    groupName: "Third Party Management"
  },
  {
    controlId: "TP-10.4",
    displayName: "Monitoring and Review",
    groupId: "TP-10",
    groupName: "Third Party Management"
  },

  // 11. Regulatory Compliance and Reporting
  {
    controlId: "RC-11.1",
    displayName: "Regulatory Compliance Framework",
    groupId: "RC-11",
    groupName: "Regulatory Compliance"
  },
  {
    controlId: "RC-11.2",
    displayName: "Reporting Requirements",
    groupId: "RC-11",
    groupName: "Regulatory Compliance"
  },
  {
    controlId: "RC-11.3",
    displayName: "Record Keeping",
    groupId: "RC-11",
    groupName: "Regulatory Compliance"
  },
  {
    controlId: "RC-11.4",
    displayName: "Audit and Assessment",
    groupId: "RC-11",
    groupName: "Regulatory Compliance"
  },

  // 12. Consumer Protection
  {
    controlId: "CP-12.1",
    displayName: "Consumer Rights and Protection",
    groupId: "CP-12",
    groupName: "Consumer Protection"
  },
  {
    controlId: "CP-12.2",
    displayName: "Complaint Handling",
    groupId: "CP-12",
    groupName: "Consumer Protection"
  },
  {
    controlId: "CP-12.3",
    displayName: "Data Privacy",
    groupId: "CP-12",
    groupName: "Consumer Protection"
  },
  {
    controlId: "CP-12.4",
    displayName: "Transaction Dispute Resolution",
    groupId: "CP-12",
    groupName: "Consumer Protection"
  }
];

export const seedSAMAPSP = async () => {
  try {
    console.log('Starting SAMA PSP seeding...');

    const existingFramework = await FrameworkModel.findOne({ 
      displayName: samaPspFrameworkData.displayName 
    });

    let framework;
    if (existingFramework) {
      console.log('SAMA PSP framework already exists, using existing one...');
      framework = existingFramework;
    } else {
      framework = await FrameworkModel.create(samaPspFrameworkData);
      console.log('SAMA PSP framework created successfully');
    }

    const existingControlsCount = await ControlModel.countDocuments({ 
      frameworkId: framework._id 
    });

    if (existingControlsCount > 0) {
      console.log(`${existingControlsCount} controls already exist for SAMA PSP framework`);
      return {
        framework,
        controlsCreated: 0,
        message: 'Framework and controls already exist'
      };
    }

    const controlsWithFrameworkId = samaPspControlsData.map(control => ({
      ...control,
      frameworkId: framework._id
    }));

    const controls = await ControlModel.insertMany(controlsWithFrameworkId);
    
    console.log(`Successfully created ${controls.length} controls for SAMA PSP framework`);
    
    return {
      framework,
      controlsCreated: controls.length,
      message: 'SAMA PSP framework and controls seeded successfully'
    };

  } catch (error) {
    console.error('Error seeding SAMA PSP:', error);
    throw error;
  }
};

export const removeSAMAPSP = async () => {
  try {
    const framework = await FrameworkModel.findOne({ 
      displayName: samaPspFrameworkData.displayName 
    });

    if (framework) {
      await ControlModel.deleteMany({ frameworkId: framework._id });
      await FrameworkModel.deleteOne({ _id: framework._id });
      console.log('SAMA PSP framework and controls removed successfully');
    } else {
      console.log('SAMA PSP framework not found');
    }
  } catch (error) {
    console.error('Error removing SAMA PSP:', error);
    throw error;
  }
};