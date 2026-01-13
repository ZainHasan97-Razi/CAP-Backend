import FrameworkModel, { FrameworkTypeEnum } from '../models/framework.model';
import ControlModel from '../models/control.model';

export const itgFrameworkData = {
  displayName: "Information Technology Governance Framework (2021)",
  type: FrameworkTypeEnum.regulatory_assessment
};

export const itgControlsData = [
  // 1. IT Strategy and Alignment
  {
    controlId: "ITSA-1.1",
    displayName: "IT Strategic Planning",
    groupId: "ITSA-1",
    groupName: "IT Strategy and Alignment"
  },
  {
    controlId: "ITSA-1.2",
    displayName: "Business-IT Alignment",
    groupId: "ITSA-1",
    groupName: "IT Strategy and Alignment"
  },
  {
    controlId: "ITSA-1.3",
    displayName: "IT Investment Portfolio Management",
    groupId: "ITSA-1",
    groupName: "IT Strategy and Alignment"
  },
  {
    controlId: "ITSA-1.4",
    displayName: "IT Architecture Management",
    groupId: "ITSA-1",
    groupName: "IT Strategy and Alignment"
  },
  {
    controlId: "ITSA-1.5",
    displayName: "Technology Standards and Guidelines",
    groupId: "ITSA-1",
    groupName: "IT Strategy and Alignment"
  },

  // 2. IT Governance Structure
  {
    controlId: "ITGS-2.1",
    displayName: "IT Governance Framework",
    groupId: "ITGS-2",
    groupName: "IT Governance Structure"
  },
  {
    controlId: "ITGS-2.2",
    displayName: "IT Steering Committee",
    groupId: "ITGS-2",
    groupName: "IT Governance Structure"
  },
  {
    controlId: "ITGS-2.3",
    displayName: "IT Roles and Responsibilities",
    groupId: "ITGS-2",
    groupName: "IT Governance Structure"
  },
  {
    controlId: "ITGS-2.4",
    displayName: "IT Decision Rights",
    groupId: "ITGS-2",
    groupName: "IT Governance Structure"
  },
  {
    controlId: "ITGS-2.5",
    displayName: "IT Governance Processes",
    groupId: "ITGS-2",
    groupName: "IT Governance Structure"
  },

  // 3. IT Risk Management
  {
    controlId: "ITRM-3.1",
    displayName: "IT Risk Management Framework",
    groupId: "ITRM-3",
    groupName: "IT Risk Management"
  },
  {
    controlId: "ITRM-3.2",
    displayName: "IT Risk Assessment",
    groupId: "ITRM-3",
    groupName: "IT Risk Management"
  },
  {
    controlId: "ITRM-3.3",
    displayName: "IT Risk Treatment",
    groupId: "ITRM-3",
    groupName: "IT Risk Management"
  },
  {
    controlId: "ITRM-3.4",
    displayName: "IT Risk Monitoring",
    groupId: "ITRM-3",
    groupName: "IT Risk Management"
  },
  {
    controlId: "ITRM-3.5",
    displayName: "IT Business Continuity",
    groupId: "ITRM-3",
    groupName: "IT Risk Management"
  },

  // 4. IT Performance Management
  {
    controlId: "ITPM-4.1",
    displayName: "IT Performance Measurement",
    groupId: "ITPM-4",
    groupName: "IT Performance Management"
  },
  {
    controlId: "ITPM-4.2",
    displayName: "IT Service Level Management",
    groupId: "ITPM-4",
    groupName: "IT Performance Management"
  },
  {
    controlId: "ITPM-4.3",
    displayName: "IT Balanced Scorecard",
    groupId: "ITPM-4",
    groupName: "IT Performance Management"
  },
  {
    controlId: "ITPM-4.4",
    displayName: "IT Value Realization",
    groupId: "ITPM-4",
    groupName: "IT Performance Management"
  },
  {
    controlId: "ITPM-4.5",
    displayName: "IT Performance Reporting",
    groupId: "ITPM-4",
    groupName: "IT Performance Management"
  },

  // 5. IT Resource Management
  {
    controlId: "ITRM-5.1",
    displayName: "IT Human Resources Management",
    groupId: "ITRM-5",
    groupName: "IT Resource Management"
  },
  {
    controlId: "ITRM-5.2",
    displayName: "IT Infrastructure Management",
    groupId: "ITRM-5",
    groupName: "IT Resource Management"
  },
  {
    controlId: "ITRM-5.3",
    displayName: "IT Asset Management",
    groupId: "ITRM-5",
    groupName: "IT Resource Management"
  },
  {
    controlId: "ITRM-5.4",
    displayName: "IT Capacity Management",
    groupId: "ITRM-5",
    groupName: "IT Resource Management"
  },
  {
    controlId: "ITRM-5.5",
    displayName: "IT Financial Management",
    groupId: "ITRM-5",
    groupName: "IT Resource Management"
  },

  // 6. IT Project and Portfolio Management
  {
    controlId: "ITPPM-6.1",
    displayName: "IT Project Governance",
    groupId: "ITPPM-6",
    groupName: "IT Project and Portfolio Management"
  },
  {
    controlId: "ITPPM-6.2",
    displayName: "IT Portfolio Management",
    groupId: "ITPPM-6",
    groupName: "IT Project and Portfolio Management"
  },
  {
    controlId: "ITPPM-6.3",
    displayName: "IT Project Management",
    groupId: "ITPPM-6",
    groupName: "IT Project and Portfolio Management"
  },
  {
    controlId: "ITPPM-6.4",
    displayName: "IT Change Management",
    groupId: "ITPPM-6",
    groupName: "IT Project and Portfolio Management"
  },
  {
    controlId: "ITPPM-6.5",
    displayName: "IT Benefits Realization",
    groupId: "ITPPM-6",
    groupName: "IT Project and Portfolio Management"
  },

  // 7. IT Service Management
  {
    controlId: "ITSM-7.1",
    displayName: "IT Service Strategy",
    groupId: "ITSM-7",
    groupName: "IT Service Management"
  },
  {
    controlId: "ITSM-7.2",
    displayName: "IT Service Design",
    groupId: "ITSM-7",
    groupName: "IT Service Management"
  },
  {
    controlId: "ITSM-7.3",
    displayName: "IT Service Transition",
    groupId: "ITSM-7",
    groupName: "IT Service Management"
  },
  {
    controlId: "ITSM-7.4",
    displayName: "IT Service Operation",
    groupId: "ITSM-7",
    groupName: "IT Service Management"
  },
  {
    controlId: "ITSM-7.5",
    displayName: "IT Service Improvement",
    groupId: "ITSM-7",
    groupName: "IT Service Management"
  },

  // 8. IT Compliance and Audit
  {
    controlId: "ITCA-8.1",
    displayName: "IT Compliance Management",
    groupId: "ITCA-8",
    groupName: "IT Compliance and Audit"
  },
  {
    controlId: "ITCA-8.2",
    displayName: "IT Audit Management",
    groupId: "ITCA-8",
    groupName: "IT Compliance and Audit"
  },
  {
    controlId: "ITCA-8.3",
    displayName: "IT Regulatory Compliance",
    groupId: "ITCA-8",
    groupName: "IT Compliance and Audit"
  },
  {
    controlId: "ITCA-8.4",
    displayName: "IT Control Assessment",
    groupId: "ITCA-8",
    groupName: "IT Compliance and Audit"
  },
  {
    controlId: "ITCA-8.5",
    displayName: "IT Compliance Reporting",
    groupId: "ITCA-8",
    groupName: "IT Compliance and Audit"
  }
];

export async function seedItgFramework() {
  try {
    console.log('Starting IT Governance Framework seeding...');

    // Check if framework already exists
    const existingFramework = await FrameworkModel.findOne({
      displayName: itgFrameworkData.displayName
    });

    if (existingFramework) {
      console.log('IT Governance Framework already exists, skipping...');
      return {
        framework: existingFramework,
        controlsCreated: 0,
        message: 'Framework already exists'
      };
    }

    // Create framework
    const framework = await FrameworkModel.create(itgFrameworkData);
    console.log(`Created framework: ${framework.displayName}`);

    // Create controls
    const controlsWithFrameworkId = itgControlsData.map(control => ({
      ...control,
      frameworkId: framework._id
    }));

    await ControlModel.insertMany(controlsWithFrameworkId);
    console.log(`Created ${itgControlsData.length} controls for IT Governance Framework`);

    console.log('IT Governance Framework seeding completed successfully');
    return {
      framework,
      controlsCreated: itgControlsData.length,
      message: 'Framework seeded successfully'
    };
  } catch (error) {
    console.error('Error seeding IT Governance Framework:', error);
    throw error;
  }
}

export async function removeItgFramework() {
  try {
    console.log('Removing IT Governance Framework...');
    
    const framework = await FrameworkModel.findOne({
      displayName: itgFrameworkData.displayName
    });
    
    if (!framework) {
      console.log('IT Governance Framework not found, nothing to remove');
      return;
    }
    
    await ControlModel.deleteMany({ frameworkId: framework._id });
    await FrameworkModel.deleteOne({ _id: framework._id });
    
    console.log('IT Governance Framework removed successfully');
  } catch (error) {
    console.error('Error removing IT Governance Framework:', error);
    throw error;
  }
}

export const seedITG = seedItgFramework;
export const removeITG = removeItgFramework;