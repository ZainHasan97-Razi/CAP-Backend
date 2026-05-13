# Roles & Permissions

## Overview

The system uses **System Roles** to control what actions a user can perform. Each user can have one or more system roles. Permissions are stored per role in the database and can be updated by a `super_admin` via the API.

---

## System Roles

| Key | Label | Description |
|---|---|---|
| `compliance_specialist` | Compliance Specialist | Creates assessments, assigns controls and findings, handles approval workflow |
| `compliance_manager` | Compliance Manager | Validates and approves assessments, assigns assessments to team |
| `control_owner` | Control Owner | Raises evidence, provides action plans and target date commitments |
| `executive` | Executive | Views the executive dashboard |
| `auditor` | Auditor | Same as Compliance Specialist plus validates compliance closure assessments |
| `super_admin` | Super Admin | Full platform access — manages roles, frameworks, dashboard, and all settings |

---

## Permissions

| Key | Label | Description |
|---|---|---|
| `create_assessment` | Create Assessment | Create new compliance assessments |
| `assign_control_owner` | Assign Control Owner | Assign relevant controls to a specific control owner |
| `assign_finding` | Assign Finding | Assign findings to a control owner |
| `approve_reject_revert_assessment` | Approve / Reject / Revert Assessment | Approve, reject, or revert an assessment |
| `assign_assessment_to_team` | Assign Assessment to Team | Assign assessments to team members |
| `close_assessment` | Close Assessment | Validate and close compliance assessments |
| `raise_evidence` | Raise Evidence | Upload and raise evidence for a control |
| `provide_action_plan` | Provide Action Plan | Provide action plan and target date commitment for findings |
| `edit_dashboard` | Edit Dashboard | View and customize the executive dashboard |
| `manage_roles_permissions` | Manage Roles & Permissions | Assign roles and edit permissions for system roles |
| `manage_frameworks` | Manage Frameworks | Upload, edit, and manage compliance frameworks |
| `manage_platform` | Manage Platform | Full platform administration and customization |

---

## Default Role → Permission Mapping

| Role | Default Permissions |
|---|---|
| `compliance_specialist` | `create_assessment`, `assign_control_owner`, `assign_finding`, `approve_reject_revert_assessment` |
| `compliance_manager` | `approve_reject_revert_assessment`, `assign_assessment_to_team` |
| `control_owner` | `raise_evidence`, `provide_action_plan` |
| `executive` | `edit_dashboard` |
| `auditor` | `create_assessment`, `assign_control_owner`, `assign_finding`, `approve_reject_revert_assessment`, `close_assessment` |
| `super_admin` | All permissions |

> These defaults are seeded automatically on server startup. They are only applied on first insert (`$setOnInsert`) — existing records are not overwritten.

---

## API Endpoints

All endpoints are protected (require `Authorization: Bearer <token>`).

### GET `/api/system-roles`
Returns all system roles with their current permissions, label, and description.

**Response:**
```json
[
  {
    "_id": "...",
    "role": "compliance_specialist",
    "label": "Compliance Specialist",
    "description": "Creates assessments, assigns controls and findings, handles approval workflow",
    "permissions": ["create_assessment", "assign_control_owner", "assign_finding", "approve_reject_revert_assessment"],
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### GET `/api/system-roles/permissions`
Returns all available permissions with their label and description. Use this to build the permission editor UI.

**Response:**
```json
[
  {
    "key": "create_assessment",
    "label": "Create Assessment",
    "description": "Create new compliance assessments"
  }
]
```

---

### PATCH `/api/system-roles/:role/permissions`
Updates the permissions for a given role. **Only `super_admin` can call this.**

**URL Params:**
- `role` — one of the system role keys (e.g. `compliance_specialist`)

**Body:**
```json
{
  "permissions": ["create_assessment", "assign_control_owner"]
}
```

**Response:** Updated role document.

---

### POST `/api/system-roles/seed`
Manually re-seeds all system roles with default permissions (only inserts missing ones, does not overwrite). Useful for dev/reset.

---

### PATCH `/api/user/:id/system-roles`
Assigns system roles to a user. **Only `super_admin` can call this.**

**Body:**
```json
{
  "systemRoles": ["compliance_specialist", "auditor"]
}
```

**Response:**
```json
{
  "message": "System roles updated",
  "user": { ... }
}
```

---

## Frontend Permission Editor (Super Admin)

To build the permissions management page:

1. Call `GET /api/system-roles` to get all roles and their current permissions.
2. Call `GET /api/system-roles/permissions` to get the full list of available permissions (with labels/descriptions for display).
3. Render a table or card per role with checkboxes for each permission.
4. On save, call `PATCH /api/system-roles/:role/permissions` with the updated permissions array.
5. Only render this page/route if the logged-in user has `systemRoles` containing `super_admin`.

---

## Notes

- A user can have **multiple** system roles (`systemRoles: string[]` on the user document).
- `systemRoles` is included in the JWT payload — frontend can read it directly from the decoded token without an extra API call.
- The `super_admin` role is the only role that can modify permissions via the API.
