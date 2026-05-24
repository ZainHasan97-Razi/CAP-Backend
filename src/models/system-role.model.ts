import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

export const SystemRoleEnum = {
  compliance_specialist: 'compliance_specialist',
  compliance_manager: 'compliance_manager',
  control_owner: 'control_owner',
  executive: 'executive',
  auditor: 'auditor',
  super_admin: 'super_admin',
} as const;
export type SystemRoleEnumType = keyof typeof SystemRoleEnum;

export const PermissionEnum = {
  // Dashboard — read-only module, no manage
  view_dashboard: 'view_dashboard',

  // Assessment module
  view_assessment: 'view_assessment',
  manage_assessment: 'manage_assessment',

  // Framework module
  view_framework: 'view_framework',
  manage_framework: 'manage_framework',

  // Control module
  view_control: 'view_control',
  manage_control: 'manage_control',

  // Evidence module (assessment comments/attachments)
  view_evidence: 'view_evidence',
  manage_evidence: 'manage_evidence',

  // User module
  view_user: 'view_user',
  manage_user: 'manage_user',

  // Department module
  view_department: 'view_department',
  manage_department: 'manage_department',

  // Reports / Analytics — read-only module, no manage
  view_report: 'view_report',

  // System administration — no view, action only
  manage_roles_permissions: 'manage_roles_permissions',
  manage_platform: 'manage_platform',
} as const;
export type PermissionEnumType = keyof typeof PermissionEnum;

export const PERMISSION_META: Record<PermissionEnumType, { label: string; description: string; type: 'view' | 'action' }> = {
  view_dashboard:           { label: 'View Dashboard',             description: 'Access the dashboard / analytics page',                          type: 'view' },
  view_assessment:          { label: 'View Assessments',           description: 'Access the assessments list and detail pages',                   type: 'view' },
  manage_assessment:        { label: 'Manage Assessments',         description: 'Create, approve, reject, revert and close assessments',          type: 'action' },
  view_framework:           { label: 'View Frameworks',            description: 'Access the frameworks list and detail pages',                    type: 'view' },
  manage_framework:         { label: 'Manage Frameworks',          description: 'Upload, edit and delete compliance frameworks',                  type: 'action' },
  view_control:             { label: 'View Controls',              description: 'Access the controls list and detail pages',                      type: 'view' },
  manage_control:           { label: 'Manage Controls',            description: 'Edit and update controls',                                       type: 'action' },
  view_evidence:            { label: 'View Evidence',              description: 'Access evidence and assessment comments',                        type: 'view' },
  manage_evidence:          { label: 'Manage Evidence',            description: 'Upload evidence, raise findings and provide action plans',       type: 'action' },
  view_user:                { label: 'View Users',                 description: 'Access the users / team list page',                              type: 'view' },
  manage_user:              { label: 'Manage Users',               description: 'Invite, edit and deactivate users',                              type: 'action' },
  view_department:          { label: 'View Departments',           description: 'Access the departments list page',                               type: 'view' },
  manage_department:        { label: 'Manage Departments',         description: 'Create and edit departments',                                    type: 'action' },
  view_report:              { label: 'View Reports',               description: 'Access reports and analytics (read-only)',                       type: 'view' },
  manage_roles_permissions: { label: 'Manage Roles & Permissions', description: 'Edit permissions for system roles (super admin only)',           type: 'action' },
  manage_platform:          { label: 'Manage Platform',            description: 'Platform settings, customization and administration',            type: 'action' },
};

export const ROLE_META: Record<SystemRoleEnumType, { label: string; description: string }> = {
  compliance_specialist: { label: 'Compliance Specialist', description: 'Creates assessments, assigns controls and findings, handles approval workflow' },
  compliance_manager:    { label: 'Compliance Manager',    description: 'Validates and approves assessments, assigns assessments to team' },
  control_owner:         { label: 'Control Owner',         description: 'Raises evidence, provides action plans and target date commitments' },
  executive:             { label: 'Executive',             description: 'Views the executive dashboard and reports' },
  auditor:               { label: 'Auditor',               description: 'Same as Compliance Specialist plus validates compliance closure assessments' },
  super_admin:           { label: 'Super Admin',           description: 'Full platform access — manages roles, frameworks, dashboard, and all settings' },
};

export const DEFAULT_ROLE_PERMISSIONS: Record<SystemRoleEnumType, PermissionEnumType[]> = {
  compliance_specialist: [
    'view_dashboard',
    'view_assessment',
    'manage_assessment',
    'view_framework',
    'view_control',
    'view_evidence',
    'manage_evidence',
    'view_user',
    'view_report',
  ],
  compliance_manager: [
    'view_dashboard',
    'view_assessment',
    'view_framework',
    'view_control',
    'view_evidence',
    'manage_evidence',
    'view_user',
    'view_report',
  ],
  control_owner: [
    'view_evidence',
    'manage_evidence',
  ],
  executive: [
    'view_dashboard',
    'view_report',
  ],
  auditor: [
    'view_dashboard',
    'view_assessment',
    'view_framework',
    'view_control',
    'view_evidence',
    'manage_evidence',
    'view_user',
    'view_report',
  ],
  super_admin: [
    'view_dashboard',
    'view_assessment',
    'manage_assessment',
    'view_framework',
    'manage_framework',
    'view_control',
    'manage_control',
    'view_evidence',
    'manage_evidence',
    'view_user',
    'manage_user',
    'view_department',
    'manage_department',
    'view_report',
    'manage_roles_permissions',
    'manage_platform',
  ],
};

const systemRoleSchema = new Schema(
  {
    role: {
      type: String,
      enum: Object.values(SystemRoleEnum),
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      enum: Object.values(PermissionEnum),
      default: [],
    },
  },
  { timestamps: true },
);

export type SystemRoleSchemaType = InferSchemaType<typeof systemRoleSchema>;
export type SystemRoleDocument = HydratedDocument<SystemRoleSchemaType>;

const SystemRoleModel = model('SystemRole', systemRoleSchema);
export default SystemRoleModel;
