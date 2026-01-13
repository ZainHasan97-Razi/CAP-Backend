import FrameworkModel, { FrameworkTypeEnum } from '../models/framework.model';
import ControlModel from '../models/control.model';

export const otccmm1FrameworkData = {
  displayName: "OTCCMM-1:2022",
  type: FrameworkTypeEnum.regulatory_assessment
};

export const otccmm1ControlsData = [
  // Section 1: Implementation Methodology
  {
    controlId: "OTCCMM-1.M.1",
    displayName: "OT Environment Assessment",
    groupId: "OTCCMM-1.M",
    groupName: "Implementation Methodology"
  },
  {
    controlId: "OTCCMM-1.M.2",
    displayName: "Asset Discovery and Inventory",
    groupId: "OTCCMM-1.M",
    groupName: "Implementation Methodology"
  },
  {
    controlId: "OTCCMM-1.M.3",
    displayName: "Risk Assessment Methodology",
    groupId: "OTCCMM-1.M",
    groupName: "Implementation Methodology"
  },
  {
    controlId: "OTCCMM-1.M.4",
    displayName: "Control Selection and Prioritization",
    groupId: "OTCCMM-1.M",
    groupName: "Implementation Methodology"
  },
  {
    controlId: "OTCCMM-1.M.5",
    displayName: "Implementation Planning",
    groupId: "OTCCMM-1.M",
    groupName: "Implementation Methodology"
  },
  {
    controlId: "OTCCMM-1.M.6",
    displayName: "Stakeholder Engagement",
    groupId: "OTCCMM-1.M",
    groupName: "Implementation Methodology"
  },
  {
    controlId: "OTCCMM-1.M.7",
    displayName: "Resource Allocation",
    groupId: "OTCCMM-1.M",
    groupName: "Implementation Methodology"
  },
  {
    controlId: "OTCCMM-1.M.8",
    displayName: "Timeline Development",
    groupId: "OTCCMM-1.M",
    groupName: "Implementation Methodology"
  },
  {
    controlId: "OTCCMM-1.M.9",
    displayName: "Change Management Process",
    groupId: "OTCCMM-1.M",
    groupName: "Implementation Methodology"
  },
  {
    controlId: "OTCCMM-1.M.10",
    displayName: "Training and Awareness Program",
    groupId: "OTCCMM-1.M",
    groupName: "Implementation Methodology"
  },
  {
    controlId: "OTCCMM-1.M.11",
    displayName: "Testing and Validation",
    groupId: "OTCCMM-1.M",
    groupName: "Implementation Methodology"
  },
  {
    controlId: "OTCCMM-1.M.12",
    displayName: "Documentation Requirements",
    groupId: "OTCCMM-1.M",
    groupName: "Implementation Methodology"
  },
  {
    controlId: "OTCCMM-1.M.13",
    displayName: "Monitoring and Measurement",
    groupId: "OTCCMM-1.M",
    groupName: "Implementation Methodology"
  },
  {
    controlId: "OTCCMM-1.M.14",
    displayName: "Continuous Improvement",
    groupId: "OTCCMM-1.M",
    groupName: "Implementation Methodology"
  },
  {
    controlId: "OTCCMM-1.M.15",
    displayName: "Compliance Verification",
    groupId: "OTCCMM-1.M",
    groupName: "Implementation Methodology"
  },

  // Section 2: Implementation Phases
  {
    controlId: "OTCCMM-1.P.1",
    displayName: "Phase 1: Planning and Preparation",
    groupId: "OTCCMM-1.P",
    groupName: "Implementation Phases"
  },
  {
    controlId: "OTCCMM-1.P.2",
    displayName: "Phase 2: Asset Discovery and Classification",
    groupId: "OTCCMM-1.P",
    groupName: "Implementation Phases"
  },
  {
    controlId: "OTCCMM-1.P.3",
    displayName: "Phase 3: Risk Assessment and Analysis",
    groupId: "OTCCMM-1.P",
    groupName: "Implementation Phases"
  },
  {
    controlId: "OTCCMM-1.P.4",
    displayName: "Phase 4: Control Implementation",
    groupId: "OTCCMM-1.P",
    groupName: "Implementation Phases"
  },
  {
    controlId: "OTCCMM-1.P.5",
    displayName: "Phase 5: Testing and Validation",
    groupId: "OTCCMM-1.P",
    groupName: "Implementation Phases"
  },
  {
    controlId: "OTCCMM-1.P.6",
    displayName: "Phase 6: Deployment and Operations",
    groupId: "OTCCMM-1.P",
    groupName: "Implementation Phases"
  },
  {
    controlId: "OTCCMM-1.P.7",
    displayName: "Phase 7: Monitoring and Maintenance",
    groupId: "OTCCMM-1.P",
    groupName: "Implementation Phases"
  },
  {
    controlId: "OTCCMM-1.P.8",
    displayName: "Phase 8: Review and Improvement",
    groupId: "OTCCMM-1.P",
    groupName: "Implementation Phases"
  },

  // Section 3: Assessment Criteria
  {
    controlId: "OTCCMM-1.A.1",
    displayName: "Governance Assessment Criteria",
    groupId: "OTCCMM-1.A",
    groupName: "Assessment Criteria"
  },
  {
    controlId: "OTCCMM-1.A.2",
    displayName: "Risk Management Assessment Criteria",
    groupId: "OTCCMM-1.A",
    groupName: "Assessment Criteria"
  },
  {
    controlId: "OTCCMM-1.A.3",
    displayName: "Asset Management Assessment Criteria",
    groupId: "OTCCMM-1.A",
    groupName: "Assessment Criteria"
  },
  {
    controlId: "OTCCMM-1.A.4",
    displayName: "Network Security Assessment Criteria",
    groupId: "OTCCMM-1.A",
    groupName: "Assessment Criteria"
  },
  {
    controlId: "OTCCMM-1.A.5",
    displayName: "Access Control Assessment Criteria",
    groupId: "OTCCMM-1.A",
    groupName: "Assessment Criteria"
  },
  {
    controlId: "OTCCMM-1.A.6",
    displayName: "System Security Assessment Criteria",
    groupId: "OTCCMM-1.A",
    groupName: "Assessment Criteria"
  },
  {
    controlId: "OTCCMM-1.A.7",
    displayName: "Data Protection Assessment Criteria",
    groupId: "OTCCMM-1.A",
    groupName: "Assessment Criteria"
  },
  {
    controlId: "OTCCMM-1.A.8",
    displayName: "Physical Security Assessment Criteria",
    groupId: "OTCCMM-1.A",
    groupName: "Assessment Criteria"
  },
  {
    controlId: "OTCCMM-1.A.9",
    displayName: "Incident Management Assessment Criteria",
    groupId: "OTCCMM-1.A",
    groupName: "Assessment Criteria"
  },
  {
    controlId: "OTCCMM-1.A.10",
    displayName: "Business Continuity Assessment Criteria",
    groupId: "OTCCMM-1.A",
    groupName: "Assessment Criteria"
  },
  {
    controlId: "OTCCMM-1.A.11",
    displayName: "Third Party Assessment Criteria",
    groupId: "OTCCMM-1.A",
    groupName: "Assessment Criteria"
  },
  {
    controlId: "OTCCMM-1.A.12",
    displayName: "Compliance Assessment Criteria",
    groupId: "OTCCMM-1.A",
    groupName: "Assessment Criteria"
  },

  // Section 4: Maturity Levels
  {
    controlId: "OTCCMM-1.ML.1",
    displayName: "Maturity Level 1: Initial",
    groupId: "OTCCMM-1.ML",
    groupName: "Maturity Levels"
  },
  {
    controlId: "OTCCMM-1.ML.2",
    displayName: "Maturity Level 2: Developing",
    groupId: "OTCCMM-1.ML",
    groupName: "Maturity Levels"
  },
  {
    controlId: "OTCCMM-1.ML.3",
    displayName: "Maturity Level 3: Defined",
    groupId: "OTCCMM-1.ML",
    groupName: "Maturity Levels"
  },
  {
    controlId: "OTCCMM-1.ML.4",
    displayName: "Maturity Level 4: Managed",
    groupId: "OTCCMM-1.ML",
    groupName: "Maturity Levels"
  },
  {
    controlId: "OTCCMM-1.ML.5",
    displayName: "Maturity Level 5: Optimized",
    groupId: "OTCCMM-1.ML",
    groupName: "Maturity Levels"
  },

  // Section 5: Mapping Components
  {
    controlId: "OTCCMM-1.MAP.1",
    displayName: "IEC 62443 Mapping",
    groupId: "OTCCMM-1.MAP",
    groupName: "Standards Mapping"
  },
  {
    controlId: "OTCCMM-1.MAP.2",
    displayName: "NIST CSF Mapping",
    groupId: "OTCCMM-1.MAP",
    groupName: "Standards Mapping"
  },
  {
    controlId: "OTCCMM-1.MAP.3",
    displayName: "ISO 27001/27002 Mapping",
    groupId: "OTCCMM-1.MAP",
    groupName: "Standards Mapping"
  },
  {
    controlId: "OTCCMM-1.MAP.4",
    displayName: "NERC CIP Mapping",
    groupId: "OTCCMM-1.MAP",
    groupName: "Standards Mapping"
  },
  {
    controlId: "OTCCMM-1.MAP.5",
    displayName: "COBIT Mapping",
    groupId: "OTCCMM-1.MAP",
    groupName: "Standards Mapping"
  },

  // Section 6: Industry Guidance
  {
    controlId: "OTCCMM-1.IG.1",
    displayName: "Oil and Gas Industry Guidance",
    groupId: "OTCCMM-1.IG",
    groupName: "Industry Guidance"
  },
  {
    controlId: "OTCCMM-1.IG.2",
    displayName: "Power and Utilities Guidance",
    groupId: "OTCCMM-1.IG",
    groupName: "Industry Guidance"
  },
  {
    controlId: "OTCCMM-1.IG.3",
    displayName: "Manufacturing Industry Guidance",
    groupId: "OTCCMM-1.IG",
    groupName: "Industry Guidance"
  },
  {
    controlId: "OTCCMM-1.IG.4",
    displayName: "Water and Wastewater Guidance",
    groupId: "OTCCMM-1.IG",
    groupName: "Industry Guidance"
  },
  {
    controlId: "OTCCMM-1.IG.5",
    displayName: "Transportation Systems Guidance",
    groupId: "OTCCMM-1.IG",
    groupName: "Industry Guidance"
  },

  // Section 7: Audit Procedures
  {
    controlId: "OTCCMM-1.AP.1",
    displayName: "Pre-Audit Planning",
    groupId: "OTCCMM-1.AP",
    groupName: "Audit Procedures"
  },
  {
    controlId: "OTCCMM-1.AP.2",
    displayName: "Evidence Collection",
    groupId: "OTCCMM-1.AP",
    groupName: "Audit Procedures"
  },
  {
    controlId: "OTCCMM-1.AP.3",
    displayName: "Control Testing",
    groupId: "OTCCMM-1.AP",
    groupName: "Audit Procedures"
  },
  {
    controlId: "OTCCMM-1.AP.4",
    displayName: "Gap Analysis",
    groupId: "OTCCMM-1.AP",
    groupName: "Audit Procedures"
  },
  {
    controlId: "OTCCMM-1.AP.5",
    displayName: "Findings Documentation",
    groupId: "OTCCMM-1.AP",
    groupName: "Audit Procedures"
  },
  {
    controlId: "OTCCMM-1.AP.6",
    displayName: "Remediation Planning",
    groupId: "OTCCMM-1.AP",
    groupName: "Audit Procedures"
  },
  {
    controlId: "OTCCMM-1.AP.7",
    displayName: "Follow-up Assessment",
    groupId: "OTCCMM-1.AP",
    groupName: "Audit Procedures"
  }
];

export const seedOTCCMM1 = async () => {
  try {
    console.log('Starting OTCCMM-1:2022 seeding...');

    const existingFramework = await FrameworkModel.findOne({ 
      displayName: otccmm1FrameworkData.displayName 
    });

    let framework;
    if (existingFramework) {
      console.log('OTCCMM-1:2022 framework already exists, using existing one...');
      framework = existingFramework;
    } else {
      framework = await FrameworkModel.create(otccmm1FrameworkData);
      console.log('OTCCMM-1:2022 framework created successfully');
    }

    const existingControlsCount = await ControlModel.countDocuments({ 
      frameworkId: framework._id 
    });

    if (existingControlsCount > 0) {
      console.log(`${existingControlsCount} controls already exist for OTCCMM-1:2022 framework`);
      return {
        framework,
        controlsCreated: 0,
        message: 'Framework and controls already exist'
      };
    }

    const controlsWithFrameworkId = otccmm1ControlsData.map(control => ({
      ...control,
      frameworkId: framework._id
    }));

    const controls = await ControlModel.insertMany(controlsWithFrameworkId);
    
    console.log(`Successfully created ${controls.length} controls for OTCCMM-1:2022 framework`);
    
    return {
      framework,
      controlsCreated: controls.length,
      message: 'OTCCMM-1:2022 framework and controls seeded successfully'
    };

  } catch (error) {
    console.error('Error seeding OTCCMM-1:2022:', error);
    throw error;
  }
};

export const removeOTCCMM1 = async () => {
  try {
    const framework = await FrameworkModel.findOne({ 
      displayName: otccmm1FrameworkData.displayName 
    });

    if (framework) {
      await ControlModel.deleteMany({ frameworkId: framework._id });
      await FrameworkModel.deleteOne({ _id: framework._id });
      console.log('OTCCMM-1:2022 framework and controls removed successfully');
    } else {
      console.log('OTCCMM-1:2022 framework not found');
    }
  } catch (error) {
    console.error('Error removing OTCCMM-1:2022:', error);
    throw error;
  }
};