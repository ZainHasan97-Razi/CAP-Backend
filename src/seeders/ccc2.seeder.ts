import FrameworkModel, { FrameworkTypeEnum } from '../models/framework.model';
import ControlModel from '../models/control.model';

export const ccc2FrameworkData = {
  displayName: "Cloud Cybersecurity Controls (CCC-2:2024)",
  type: FrameworkTypeEnum.regulatory_assessment
};

export const ccc2ControlsData = [
  // 1. Cloud Governance
  {
    controlId: "CG-1.1",
    displayName: "Cloud Strategy and Policy",
    groupId: "CG-1",
    groupName: "Cloud Governance"
  },
  {
    controlId: "CG-1.2",
    displayName: "Cloud Governance Framework",
    groupId: "CG-1",
    groupName: "Cloud Governance"
  },
  {
    controlId: "CG-1.3",
    displayName: "Cloud Organizational Structure",
    groupId: "CG-1",
    groupName: "Cloud Governance"
  },
  {
    controlId: "CG-1.4",
    displayName: "Cloud Roles and Responsibilities",
    groupId: "CG-1",
    groupName: "Cloud Governance"
  },
  {
    controlId: "CG-1.5",
    displayName: "Cloud Training and Awareness",
    groupId: "CG-1",
    groupName: "Cloud Governance"
  },
  {
    controlId: "CG-1.6",
    displayName: "Cloud Performance Management",
    groupId: "CG-1",
    groupName: "Cloud Governance"
  },
  {
    controlId: "CG-1.7",
    displayName: "Cloud Service Catalog Management",
    groupId: "CG-1",
    groupName: "Cloud Governance"
  },

  // 2. Cloud Risk Management
  {
    controlId: "CRM-2.1",
    displayName: "Cloud Risk Management Framework",
    groupId: "CRM-2",
    groupName: "Cloud Risk Management"
  },
  {
    controlId: "CRM-2.2",
    displayName: "Cloud Risk Assessment",
    groupId: "CRM-2",
    groupName: "Cloud Risk Management"
  },
  {
    controlId: "CRM-2.3",
    displayName: "Cloud Risk Treatment",
    groupId: "CRM-2",
    groupName: "Cloud Risk Management"
  },
  {
    controlId: "CRM-2.4",
    displayName: "Cloud Risk Monitoring",
    groupId: "CRM-2",
    groupName: "Cloud Risk Management"
  },
  {
    controlId: "CRM-2.5",
    displayName: "Cloud Risk Communication",
    groupId: "CRM-2",
    groupName: "Cloud Risk Management"
  },
  {
    controlId: "CRM-2.6",
    displayName: "Cloud Risk Register Management",
    groupId: "CRM-2",
    groupName: "Cloud Risk Management"
  },

  // 3. Cloud Service Provider Management
  {
    controlId: "CSPM-3.1",
    displayName: "Cloud Service Provider Selection",
    groupId: "CSPM-3",
    groupName: "Cloud Service Provider Management"
  },
  {
    controlId: "CSPM-3.2",
    displayName: "Cloud Service Agreements",
    groupId: "CSPM-3",
    groupName: "Cloud Service Provider Management"
  },
  {
    controlId: "CSPM-3.3",
    displayName: "Cloud Service Provider Assessment",
    groupId: "CSPM-3",
    groupName: "Cloud Service Provider Management"
  },
  {
    controlId: "CSPM-3.4",
    displayName: "Cloud Service Provider Monitoring",
    groupId: "CSPM-3",
    groupName: "Cloud Service Provider Management"
  },
  {
    controlId: "CSPM-3.5",
    displayName: "Cloud Service Level Management",
    groupId: "CSPM-3",
    groupName: "Cloud Service Provider Management"
  },
  {
    controlId: "CSPM-3.6",
    displayName: "Cloud Vendor Lock-in Management",
    groupId: "CSPM-3",
    groupName: "Cloud Service Provider Management"
  },
  {
    controlId: "CSPM-3.7",
    displayName: "Cloud Exit Strategy",
    groupId: "CSPM-3",
    groupName: "Cloud Service Provider Management"
  },
  {
    controlId: "CSPM-3.8",
    displayName: "Cloud Supply Chain Security",
    groupId: "CSPM-3",
    groupName: "Cloud Service Provider Management"
  },

  // 4. Cloud Architecture Security
  {
    controlId: "CAS-4.1",
    displayName: "Secure Cloud Architecture Design",
    groupId: "CAS-4",
    groupName: "Cloud Architecture Security"
  },
  {
    controlId: "CAS-4.2",
    displayName: "Cloud Multi-tenancy Security",
    groupId: "CAS-4",
    groupName: "Cloud Architecture Security"
  },
  {
    controlId: "CAS-4.3",
    displayName: "Cloud Resource Isolation",
    groupId: "CAS-4",
    groupName: "Cloud Architecture Security"
  },
  {
    controlId: "CAS-4.4",
    displayName: "Cloud Hypervisor Security",
    groupId: "CAS-4",
    groupName: "Cloud Architecture Security"
  },
  {
    controlId: "CAS-4.5",
    displayName: "Cloud API Security",
    groupId: "CAS-4",
    groupName: "Cloud Architecture Security"
  },
  {
    controlId: "CAS-4.6",
    displayName: "Cloud Configuration Management",
    groupId: "CAS-4",
    groupName: "Cloud Architecture Security"
  },
  {
    controlId: "CAS-4.7",
    displayName: "Cloud Infrastructure as Code Security",
    groupId: "CAS-4",
    groupName: "Cloud Architecture Security"
  },
  {
    controlId: "CAS-4.8",
    displayName: "Cloud Orchestration Security",
    groupId: "CAS-4",
    groupName: "Cloud Architecture Security"
  },
  {
    controlId: "CAS-4.9",
    displayName: "Cloud Microservices Security",
    groupId: "CAS-4",
    groupName: "Cloud Architecture Security"
  },

  // 5. Identity and Access Management
  {
    controlId: "IAM-5.1",
    displayName: "Cloud Identity Management",
    groupId: "IAM-5",
    groupName: "Identity and Access Management"
  },
  {
    controlId: "IAM-5.2",
    displayName: "Cloud Authentication",
    groupId: "IAM-5",
    groupName: "Identity and Access Management"
  },
  {
    controlId: "IAM-5.3",
    displayName: "Cloud Authorization",
    groupId: "IAM-5",
    groupName: "Identity and Access Management"
  },
  {
    controlId: "IAM-5.4",
    displayName: "Cloud Privileged Access Management",
    groupId: "IAM-5",
    groupName: "Identity and Access Management"
  },
  {
    controlId: "IAM-5.5",
    displayName: "Cloud Single Sign-On",
    groupId: "IAM-5",
    groupName: "Identity and Access Management"
  },
  {
    controlId: "IAM-5.6",
    displayName: "Cloud Multi-Factor Authentication",
    groupId: "IAM-5",
    groupName: "Identity and Access Management"
  },
  {
    controlId: "IAM-5.7",
    displayName: "Cloud Access Review and Certification",
    groupId: "IAM-5",
    groupName: "Identity and Access Management"
  },
  {
    controlId: "IAM-5.8",
    displayName: "Cloud Federation and Trust",
    groupId: "IAM-5",
    groupName: "Identity and Access Management"
  },

  // 6. Data Protection in Cloud
  {
    controlId: "DPC-6.1",
    displayName: "Cloud Data Classification",
    groupId: "DPC-6",
    groupName: "Data Protection in Cloud"
  },
  {
    controlId: "DPC-6.2",
    displayName: "Cloud Data Encryption",
    groupId: "DPC-6",
    groupName: "Data Protection in Cloud"
  },
  {
    controlId: "DPC-6.3",
    displayName: "Cloud Key Management",
    groupId: "DPC-6",
    groupName: "Data Protection in Cloud"
  },
  {
    controlId: "DPC-6.4",
    displayName: "Cloud Data Loss Prevention",
    groupId: "DPC-6",
    groupName: "Data Protection in Cloud"
  },
  {
    controlId: "DPC-6.5",
    displayName: "Cloud Data Residency",
    groupId: "DPC-6",
    groupName: "Data Protection in Cloud"
  },
  {
    controlId: "DPC-6.6",
    displayName: "Cloud Data Portability",
    groupId: "DPC-6",
    groupName: "Data Protection in Cloud"
  },
  {
    controlId: "DPC-6.7",
    displayName: "Cloud Data Anonymization",
    groupId: "DPC-6",
    groupName: "Data Protection in Cloud"
  },

  // 7. Network Security
  {
    controlId: "NS-7.1",
    displayName: "Cloud Network Segmentation",
    groupId: "NS-7",
    groupName: "Network Security"
  },
  {
    controlId: "NS-7.2",
    displayName: "Cloud Virtual Private Networks",
    groupId: "NS-7",
    groupName: "Network Security"
  },
  {
    controlId: "NS-7.3",
    displayName: "Cloud Firewall Management",
    groupId: "NS-7",
    groupName: "Network Security"
  },
  {
    controlId: "NS-7.4",
    displayName: "Cloud Network Monitoring",
    groupId: "NS-7",
    groupName: "Network Security"
  },
  {
    controlId: "NS-7.5",
    displayName: "Cloud DDoS Protection",
    groupId: "NS-7",
    groupName: "Network Security"
  },
  {
    controlId: "NS-7.6",
    displayName: "Cloud DNS Security",
    groupId: "NS-7",
    groupName: "Network Security"
  },

  // 8. Compute Security
  {
    controlId: "CS-8.1",
    displayName: "Cloud Virtual Machine Security",
    groupId: "CS-8",
    groupName: "Compute Security"
  },
  {
    controlId: "CS-8.2",
    displayName: "Cloud Container Security",
    groupId: "CS-8",
    groupName: "Compute Security"
  },
  {
    controlId: "CS-8.3",
    displayName: "Cloud Serverless Security",
    groupId: "CS-8",
    groupName: "Compute Security"
  },
  {
    controlId: "CS-8.4",
    displayName: "Cloud Image and Template Security",
    groupId: "CS-8",
    groupName: "Compute Security"
  },
  {
    controlId: "CS-8.5",
    displayName: "Cloud Runtime Security",
    groupId: "CS-8",
    groupName: "Compute Security"
  },

  // 9. Storage Security
  {
    controlId: "SS-9.1",
    displayName: "Cloud Storage Encryption",
    groupId: "SS-9",
    groupName: "Storage Security"
  },
  {
    controlId: "SS-9.2",
    displayName: "Cloud Storage Access Controls",
    groupId: "SS-9",
    groupName: "Storage Security"
  },
  {
    controlId: "SS-9.3",
    displayName: "Cloud Backup and Recovery",
    groupId: "SS-9",
    groupName: "Storage Security"
  },
  {
    controlId: "SS-9.4",
    displayName: "Cloud Storage Monitoring",
    groupId: "SS-9",
    groupName: "Storage Security"
  },

  // 10. Application Security
  {
    controlId: "AS-10.1",
    displayName: "Cloud Application Development Security",
    groupId: "AS-10",
    groupName: "Application Security"
  },
  {
    controlId: "AS-10.2",
    displayName: "Cloud API Security",
    groupId: "AS-10",
    groupName: "Application Security"
  },
  {
    controlId: "AS-10.3",
    displayName: "Cloud Application Testing",
    groupId: "AS-10",
    groupName: "Application Security"
  },
  {
    controlId: "AS-10.4",
    displayName: "Cloud Web Application Security",
    groupId: "AS-10",
    groupName: "Application Security"
  },
  {
    controlId: "AS-10.5",
    displayName: "Cloud Mobile Application Security",
    groupId: "AS-10",
    groupName: "Application Security"
  },
  {
    controlId: "AS-10.6",
    displayName: "Cloud DevSecOps",
    groupId: "AS-10",
    groupName: "Application Security"
  },

  // 11. Monitoring and Logging
  {
    controlId: "ML-11.1",
    displayName: "Cloud Security Monitoring",
    groupId: "ML-11",
    groupName: "Monitoring and Logging"
  },
  {
    controlId: "ML-11.2",
    displayName: "Cloud Log Management",
    groupId: "ML-11",
    groupName: "Monitoring and Logging"
  },
  {
    controlId: "ML-11.3",
    displayName: "Cloud SIEM Integration",
    groupId: "ML-11",
    groupName: "Monitoring and Logging"
  },
  {
    controlId: "ML-11.4",
    displayName: "Cloud Threat Detection",
    groupId: "ML-11",
    groupName: "Monitoring and Logging"
  },
  {
    controlId: "ML-11.5",
    displayName: "Cloud Security Analytics",
    groupId: "ML-11",
    groupName: "Monitoring and Logging"
  },

  // 12. Incident Response
  {
    controlId: "IR-12.1",
    displayName: "Cloud Incident Response Plan",
    groupId: "IR-12",
    groupName: "Incident Response"
  },
  {
    controlId: "IR-12.2",
    displayName: "Cloud Incident Detection",
    groupId: "IR-12",
    groupName: "Incident Response"
  },
  {
    controlId: "IR-12.3",
    displayName: "Cloud Forensics",
    groupId: "IR-12",
    groupName: "Incident Response"
  },
  {
    controlId: "IR-12.4",
    displayName: "Cloud Incident Recovery",
    groupId: "IR-12",
    groupName: "Incident Response"
  },

  // 13. Business Continuity and Disaster Recovery
  {
    controlId: "BCDR-13.1",
    displayName: "Cloud Business Continuity Planning",
    groupId: "BCDR-13",
    groupName: "Business Continuity and Disaster Recovery"
  },
  {
    controlId: "BCDR-13.2",
    displayName: "Cloud Disaster Recovery",
    groupId: "BCDR-13",
    groupName: "Business Continuity and Disaster Recovery"
  },
  {
    controlId: "BCDR-13.3",
    displayName: "Cloud Backup Strategy",
    groupId: "BCDR-13",
    groupName: "Business Continuity and Disaster Recovery"
  },
  {
    controlId: "BCDR-13.4",
    displayName: "Cloud Recovery Testing",
    groupId: "BCDR-13",
    groupName: "Business Continuity and Disaster Recovery"
  },
  {
    controlId: "BCDR-13.5",
    displayName: "Cloud Resilience Management",
    groupId: "BCDR-13",
    groupName: "Business Continuity and Disaster Recovery"
  },

  // 14. Compliance and Audit
  {
    controlId: "CA-14.1",
    displayName: "Cloud Compliance Management",
    groupId: "CA-14",
    groupName: "Compliance and Audit"
  },
  {
    controlId: "CA-14.2",
    displayName: "Cloud Audit Trails",
    groupId: "CA-14",
    groupName: "Compliance and Audit"
  },
  {
    controlId: "CA-14.3",
    displayName: "Cloud Compliance Reporting",
    groupId: "CA-14",
    groupName: "Compliance and Audit"
  },
  {
    controlId: "CA-14.4",
    displayName: "Cloud Regulatory Compliance",
    groupId: "CA-14",
    groupName: "Compliance and Audit"
  }
];

export async function seedCcc2Framework() {
  try {
    console.log('Starting CCC-2:2024 framework seeding...');

    // Check if framework already exists
    const existingFramework = await FrameworkModel.findOne({
      displayName: ccc2FrameworkData.displayName
    });

    if (existingFramework) {
      console.log('CCC-2:2024 framework already exists, skipping...');
      return {
        framework: existingFramework,
        controlsCreated: 0,
        message: 'Framework already exists'
      };
    }

    // Create framework
    const framework = await FrameworkModel.create(ccc2FrameworkData);
    console.log(`Created framework: ${framework.displayName}`);

    // Create controls
    const controlsWithFrameworkId = ccc2ControlsData.map(control => ({
      ...control,
      frameworkId: framework._id,
      frameworkName: framework.displayName
    }));

    await ControlModel.insertMany(controlsWithFrameworkId);
    console.log(`Created ${ccc2ControlsData.length} controls for CCC-2:2024`);

    console.log('CCC-2:2024 framework seeding completed successfully');
    return {
      framework,
      controlsCreated: ccc2ControlsData.length,
      message: 'Framework seeded successfully'
    };
  } catch (error) {
    console.error('Error seeding CCC-2:2024 framework:', error);
    throw error;
  }
}

export async function removeCcc2Framework() {
  try {
    console.log('Removing CCC-2:2024 framework...');
    
    const framework = await FrameworkModel.findOne({
      displayName: ccc2FrameworkData.displayName
    });
    
    if (!framework) {
      console.log('CCC-2:2024 framework not found, nothing to remove');
      return;
    }
    
    await ControlModel.deleteMany({ frameworkId: framework._id });
    await FrameworkModel.deleteOne({ _id: framework._id });
    
    console.log('CCC-2:2024 framework removed successfully');
  } catch (error) {
    console.error('Error removing CCC-2:2024 framework:', error);
    throw error;
  }
}

export const seedCCC2 = seedCcc2Framework;
export const removeCCC2 = removeCcc2Framework;