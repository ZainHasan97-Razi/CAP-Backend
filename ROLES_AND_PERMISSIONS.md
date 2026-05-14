# Roles & Permissions

## Overview

The system uses **System Roles** to control what a user can see and do. Each user can have one or more system roles (`systemRoles: string[]`). Permissions are stored per role in the database and can be updated by a `super_admin` via the API.

Permissions follow a **module-based convention**:

- `view_<module>` — controls whether the tab/page is visible to the user
- `manage_<module>` — controls whether edit/create/delete actions are available on that page
- Some modules are **read-only** (e.g. dashboard, reports) — they only have a `view_*` permission
- Some modules are **action-only** (e.g. manage_roles_permissions) — no view guard needed

---

## Modules

| Module | Base API Route | View Permission | Manage Permission |
|---|---|---|---|
| Dashboard | — | `view_dashboard` | — *(read-only)* |
| Assessment | `/api/assesment` | `view_assessment` | `manage_assessment` |
| Framework | `/api/framework` | `view_framework` | `manage_framework` |
| Control | `/api/control` | `view_control` | `manage_control` |
| Evidence | `/api/assesment-comment` | `view_evidence` | `manage_evidence` |
| User | `/api/user` | `view_user` | `manage_user` |
| Department | `/api/department` | `view_department` | `manage_department` |
| Reports / Analytics | — | `view_report` | — *(read-only)* |
| Roles & Permissions | `/api/system-roles` | — | `manage_roles_permissions` |
| Platform Settings | — | — | `manage_platform` |

---

## All Permissions

| Key | Type | Label | Description |
|---|---|---|---|
| `view_dashboard` | view | View Dashboard | Access the dashboard / analytics page |
| `view_assessment` | view | View Assessments | Access the assessments list and detail pages |
| `manage_assessment` | action | Manage Assessments | Create, approve, reject, revert and close assessments |
| `view_framework` | view | View Frameworks | Access the frameworks list and detail pages |
| `manage_framework` | action | Manage Frameworks | Upload, edit and delete compliance frameworks |
| `view_control` | view | View Controls | Access the controls list and detail pages |
| `manage_control` | action | Manage Controls | Edit and update controls |
| `view_evidence` | view | View Evidence | Access evidence and assessment comments |
| `manage_evidence` | action | Manage Evidence | Upload evidence, raise findings and provide action plans |
| `view_user` | view | View Users | Access the users / team list page |
| `manage_user` | action | Manage Users | Invite, edit and deactivate users |
| `view_department` | view | View Departments | Access the departments list page |
| `manage_department` | action | Manage Departments | Create and edit departments |
| `view_report` | view | View Reports | Access reports and analytics (read-only) |
| `manage_roles_permissions` | action | Manage Roles & Permissions | Edit permissions for system roles (super admin only) |
| `manage_platform` | action | Manage Platform | Platform settings, customization and administration |

---

## System Roles

| Key | Label | Description |
|---|---|---|
| `compliance_specialist` | Compliance Specialist | Creates assessments, assigns controls and findings, handles approval workflow |
| `compliance_manager` | Compliance Manager | Validates and approves assessments, assigns assessments to team |
| `control_owner` | Control Owner | Raises evidence, provides action plans and target date commitments |
| `executive` | Executive | Views the executive dashboard and reports |
| `auditor` | Auditor | Same as Compliance Specialist plus validates compliance closure assessments |
| `super_admin` | Super Admin | Full platform access — manages roles, frameworks, dashboard, and all settings |

---

## Default Role → Permission Mapping

| Role | Permissions |
|---|---|
| `compliance_specialist` | `view_dashboard`, `view_assessment`, `manage_assessment`, `view_framework`, `view_control`, `view_evidence`, `view_user`, `view_report` |
| `compliance_manager` | `view_dashboard`, `view_assessment`, `manage_assessment`, `view_framework`, `view_control`, `view_evidence`, `view_user`, `view_report` |
| `control_owner` | `view_assessment`, `view_evidence`, `manage_evidence`, `view_report` |
| `executive` | `view_dashboard`, `view_report` |
| `auditor` | `view_dashboard`, `view_assessment`, `manage_assessment`, `view_framework`, `view_control`, `view_evidence`, `manage_evidence`, `view_user`, `view_report` |
| `super_admin` | All permissions |

> Default permissions are applied on every server startup. If a role's permissions were manually customised via the API, they **will be reset** on next restart. To preserve custom permissions, the seeder uses `$set` only for the defaults — if you want sticky custom permissions, let the backend team know and we can switch back to `$setOnInsert`.

---

## API Endpoints

All endpoints require `Authorization: Bearer <token>`.

---

### `GET /api/system-roles`

Returns all system roles with their current permissions, label and description.

**Response:**
```json
[
  {
    "_id": "...",
    "role": "compliance_specialist",
    "label": "Compliance Specialist",
    "description": "Creates assessments, assigns controls and findings, handles approval workflow",
    "permissions": ["view_dashboard", "view_assessment", "manage_assessment"],
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### `GET /api/system-roles/permissions`

Returns all available permissions grouped by type. Use this to build the permission editor UI.

**Response:**
```json
{
  "view": [
    { "key": "view_dashboard", "label": "View Dashboard", "description": "Access the dashboard / analytics page" },
    { "key": "view_assessment", "label": "View Assessments", "description": "Access the assessments list and detail pages" }
  ],
  "action": [
    { "key": "manage_assessment", "label": "Manage Assessments", "description": "Create, approve, reject, revert and close assessments" }
  ]
}
```

---

### `PATCH /api/system-roles/:role/permissions`

Updates the permissions for a given role. **Only `super_admin` can call this.**

**URL Params:**
- `role` — one of the system role keys (e.g. `compliance_specialist`)

**Body:**
```json
{
  "permissions": ["view_assessment", "manage_assessment", "view_framework"]
}
```

**Response:** Updated role document.

---

### `PATCH /api/user/:id/system-roles`

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

### `POST /api/system-roles/seed`

Manually re-seeds all system roles with default permissions. Useful for dev/reset.

---

## Frontend Integration Guide

### 1. Resolving a user's effective permissions

The JWT payload contains `systemRoles: string[]`. On login, also fetch `GET /api/system-roles` once and cache it. Then resolve permissions client-side:

```ts
// After login — store this in global state (Redux / Zustand / Context)
const roleMap = await fetch('/api/system-roles') // [{ role, permissions[] }]

function getEffectivePermissions(systemRoles: string[], roleMap): string[] {
  const perms = new Set<string>();
  roleMap
    .filter(r => systemRoles.includes(r.role))
    .forEach(r => r.permissions.forEach(p => perms.add(p)));
  return [...perms];
}

const effectivePermissions = getEffectivePermissions(user.systemRoles, roleMap);
```

### 2. Guarding page/tab visibility

```ts
// Only show the tab if user has view permission
const canViewFrameworks = effectivePermissions.includes('view_framework');
```

### 3. Guarding action buttons

```ts
// Only show edit button if user has manage permission
const canManageFrameworks = effectivePermissions.includes('manage_framework');
```

### 4. Recommended helper

```ts
function hasPermission(effectivePermissions: string[], permission: string): boolean {
  return effectivePermissions.includes(permission);
}

// Usage
hasPermission(effectivePermissions, 'view_framework')   // show tab
hasPermission(effectivePermissions, 'manage_framework') // show edit button
```

### 5. Permission editor page (super admin only)

1. Only render this page if `user.systemRoles.includes('super_admin')`
2. Fetch `GET /api/system-roles` — renders each role as a card/row
3. Fetch `GET /api/system-roles/permissions` — use `view` and `action` groups to render two sections of checkboxes per role
4. On save call `PATCH /api/system-roles/:role/permissions` with the full updated permissions array

---

## Notes

- A user can have **multiple** system roles — effective permissions are the **union** of all role permissions
- `systemRoles` is included in the JWT — no extra API call needed to know the user's roles
- Old tokens (issued before this update) won't have `systemRoles` — users need to log in again
- The `manage_*` permission does **not** imply `view_*` — both must be granted if you want the user to see the page AND edit
