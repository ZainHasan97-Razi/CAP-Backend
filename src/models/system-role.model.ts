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
  create_assessment: 'create_assessment',
  assign_control_owner: 'assign_control_owner',
  assign_finding: 'assign_finding',
  approve_reject_revert_assessment: 'approve_reject_revert_assessment',
  assign_assessment_to_team: 'assign_assessment_to_team',
  close_assessment: 'close_assessment',
  raise_evidence: 'raise_evidence',
  provide_action_plan: 'provide_action_plan',
  edit_dashboard: 'edit_dashboard',
  manage_roles_permissions: 'manage_roles_permissions',
  manage_frameworks: 'manage_frameworks',
  manage_platform: 'manage_platform',
} as const;
export type PermissionEnumType = keyof typeof PermissionEnum;

export const PERMISSION_META: Record<PermissionEnumType, { label: string; description: string }> = {
  create_assessment: { label: 'Create Assessment', description: 'Create new compliance assessments' },
  assign_control_owner: { label: 'Assign Control Owner', description: 'Assign relevant controls to a specific control owner' },
  assign_finding: { label: 'Assign Finding', description: 'Assign findings to a control owner' },
  approve_reject_revert_assessment: { label: 'Approve / Reject / Revert Assessment', description: 'Approve, reject, or revert an assessment' },
  assign_assessment_to_team: { label: 'Assign Assessment to Team', description: 'Assign assessments to team members' },
  close_assessment: { label: 'Close Assessment', description: 'Validate and close compliance assessments' },
  raise_evidence: { label: 'Raise Evidence', description: 'Upload and raise evidence for a control' },
  provide_action_plan: { label: 'Provide Action Plan', description: 'Provide action plan and target date commitment for findings' },
  edit_dashboard: { label: 'Edit Dashboard', description: 'View and customize the executive dashboard' },
  manage_roles_permissions: { label: 'Manage Roles & Permissions', description: 'Assign roles and edit permissions for system roles' },
  manage_frameworks: { label: 'Manage Frameworks', description: 'Upload, edit, and manage compliance frameworks' },
  manage_platform: { label: 'Manage Platform', description: 'Full platform administration and customization' },
};

export const ROLE_META: Record<SystemRoleEnumType, { label: string; description: string }> = {
  compliance_specialist: { label: 'Compliance Specialist', description: 'Creates assessments, assigns controls and findings, handles approval workflow' },
  compliance_manager: { label: 'Compliance Manager', description: 'Validates and approves assessments, assigns assessments to team' },
  control_owner: { label: 'Control Owner', description: 'Raises evidence, provides action plans and target date commitments' },
  executive: { label: 'Executive', description: 'Views the executive dashboard' },
  auditor: { label: 'Auditor', description: 'Same as Compliance Specialist plus validates compliance closure assessments' },
  super_admin: { label: 'Super Admin', description: 'Full platform access — manages roles, frameworks, dashboard, and all settings' },
};

export const DEFAULT_ROLE_PERMISSIONS: Record<SystemRoleEnumType, PermissionEnumType[]> = {
  compliance_specialist: [
    'create_assessment',
    'assign_control_owner',
    'assign_finding',
    'approve_reject_revert_assessment',
  ],
  compliance_manager: [
    'approve_reject_revert_assessment',
    'assign_assessment_to_team',
  ],
  control_owner: [
    'raise_evidence',
    'provide_action_plan',
  ],
  executive: [
    'edit_dashboard',
  ],
  auditor: [
    'create_assessment',
    'assign_control_owner',
    'assign_finding',
    'approve_reject_revert_assessment',
    'close_assessment',
  ],
  super_admin: [
    'create_assessment',
    'assign_control_owner',
    'assign_finding',
    'approve_reject_revert_assessment',
    'assign_assessment_to_team',
    'close_assessment',
    'raise_evidence',
    'provide_action_plan',
    'edit_dashboard',
    'manage_roles_permissions',
    'manage_frameworks',
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
