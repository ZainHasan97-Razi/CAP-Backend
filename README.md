# CAP Backend — Documentation

## What is CAP?

CAP (Compliance Assessment Platform) is a backend system for managing compliance assessments across multiple regulatory frameworks (SAMA, ISO 27001, NCA, etc.). It supports framework management, control tracking, evidence collection, AI-assisted analysis, and role-based access control.

**Base URL:** `http://localhost:9000`  
**Auth:** All protected routes require `Authorization: Bearer <token>` unless noted otherwise.

---

## Modules

| Module | Description | Docs |
|--------|-------------|------|
| Frameworks | Create and manage compliance frameworks with metric configuration | [→ Framework API](docs/frameworks/FRAMEWORKS_API.md) |
| Controls | Manage controls within frameworks (hierarchical: Domain → Subdomain → Control) | [→ Controls API](docs/controls/CONTROLS_API.md) |
| Assessments | Create, track and manage compliance assessments | [→ Assessment Module Guide](docs/assessments/ASSESSMENT_MODULE_GUIDE.md) |
| Analytics | Dashboard analytics, framework summaries, metric distributions | [→ Analytics API](docs/analytics/ANALYTICS_API.md) |
| AI Integration | AI-powered evidence analysis and grading | [→ AI Integration](docs/ai/AI_INTEGRATION.md) |
| Users & Departments | User registration, listing, role assignment, department management | [→ User Management](docs/users/USER_MANAGEMENT.md) |
| Roles & Permissions | System roles, permissions, and access control | [→ Roles & Permissions](docs/roles/ROLES_AND_PERMISSIONS.md) |

---

## Quick Reference — All Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login and get JWT token |
| POST | `/api/auth/logout` | Bearer token | Logout current session |

### Frameworks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/framework/create` | Create a framework |
| PATCH | `/api/framework/:id` | Update a framework |
| GET | `/api/framework/list` | List active frameworks |
| GET | `/api/framework/:id` | Get framework details |
| POST | `/api/framework/upload-csv` | Bulk upload controls via CSV |

### Controls
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/control/create` | Create a control |
| PATCH | `/api/control/update/:id` | Update a control |
| GET | `/api/control/list/:frameworkId` | List controls for a framework |
| GET | `/api/control/details/:controlCode` | Get control details with recent assessments |

### Assessments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assesment/create` | Create a draft assessment (no controls required) |
| GET | `/api/assesment/dashboard` | List assessments — one row per assessment |
| GET | `/api/assesment/my-controls` | List controls assigned to the logged-in user (My Tasks) |
| GET | `/api/assesment/:assesmentId/assigned-controls` | Get already-assigned controls for an assessment |
| POST | `/api/assesment/:assesmentId/assign-controls` | Assign controls to a drafted assessment |
| PATCH | `/api/assesment/assigned-controls/:assessmentRecordId` | Update departments or participants on an assigned control |
| PATCH | `/api/assesment/:assesmentId/bulk-close` | Bulk close selected control records — `compliance_manager` only |
| PATCH | `/api/assesment/:id/request-review` | Request reviewer sign-off — `compliance_manager` only |
| PATCH | `/api/assesment/:id/reviewer-signoff` | Approve assessment for closure — `assessment_reviewer` only |
| GET | `/api/assesment/:id` | Get assessment details |
| PUT | `/api/assesment/:id` | Update an assessment |
| PATCH | `/api/assesment/:id/import-evidence` | Import evidence from another assessment |

### Assessment Comments (Evidence)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assesment-comment/:assessmentId/comments/create` | Add a comment/evidence — attachments restricted to `compliance_manager` and `control_owner` |
| GET | `/api/assesment-comment/:assessmentId/comments` | Get comments for an assessment (includes `isStale` flag) |
| PATCH | `/api/assesment-comment/comments/:commentId/approval` | Approve or reject evidence — `compliance_manager` or `assessment_reviewer` only |
| GET | `/api/assesment-comment/comments/:commentId/versions` | Get full version history for a comment |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assesment/analytics` | Overall analytics with per-framework distribution |
| GET | `/api/assesment/framework-summaries` | Framework cards with average score and hover distribution |
| GET | `/api/assesment/framework-analytics/:frameworkId` | Single-framework graph data with optional domain filter |
| GET | `/api/assessments/by-metric` | Paginated assessment list for a specific metric value |

### Audit Logs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/activity/list` | Bearer token — `auditor` or `super_admin` only | List audit log entries (paginated) |

### Common Controls
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/common-control/list` | List common controls with mapped framework controls |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/user/register` | Bearer token — `super_admin`, `compliance_specialist`, or `compliance_manager` only | Register a new user |
| GET | `/api/user/list` | Bearer token | List all users (paginated) |
| GET | `/api/user/by-departments` | Bearer token | Get users by department IDs |
| GET | `/api/user/:id` | Bearer token | Get user by ID |
| PATCH | `/api/user/:id/system-roles` | Bearer token — `super_admin` only | Assign system roles to a user |
| PATCH | `/api/user/:id/password` | Bearer token — `super_admin` only | Update a user's password |

### Departments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/department/list` | Public | List all active departments |
| POST | `/api/department/create` | Bearer token — `super_admin` or `executive` only | Create a new department |
| PATCH | `/api/department/update` | Bearer token | Update a department |

### Roles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/system-roles` | List all roles with permissions |
| GET | `/api/system-roles/permissions` | List all available permissions |

### AI (API Key Protected)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/ai/frameworks` | `x-api-key` | List all active frameworks |
| GET | `/api/ai/frameworks/:frameworkId/controls` | `x-api-key` | List controls for a framework |
| GET | `/api/ai/controls/:controlCode` | `x-api-key` | Get control details |
| POST | `/api/ai/webhook/result` | `x-webhook-secret` | Deliver AI analysis result |

---

## Key Concepts

**Assessment grouping** — Multiple assessment records share the same `assesmentId` (UUID). One draft header record (`control: null`, `status: drafted`) is created first. Control records are added separately via the assign-controls endpoint. A common assessment spanning multiple frameworks has one draft header per framework, all sharing the same UUID.

**Two-step creation flow** — Step 1: create the assessment (name, framework, dates only) → status `drafted`. Step 2: assign controls with departments and participants → per-control records with status `open`. See [Assessment Module Guide](docs/assessments/ASSESSMENT_MODULE_GUIDE.md) for full frontend page guide.

**Compliance Metric** — Every framework defines a `complianceMetric` (either `maturity_level` or `percentage`) that drives how assessment scores are tracked and displayed.

**Evidence flow** — `compliance_manager` or `control_owner` uploads evidence via comments → `compliance_manager` or `assessment_reviewer` approves → AI analyzes → Result stored on the assessment. The assessment creator cannot approve their own evidence (SoD enforcement).

**Roles** — Users have `systemRoles` (e.g. `compliance_specialist`, `auditor`, `super_admin`) that map to granular `view_*` / `manage_*` permissions. See [Roles & Permissions](docs/roles/ROLES_AND_PERMISSIONS.md) for the full matrix.

**Segregation of Duties (SoD)** — Key enforced separations:
- `super_admin` cannot create, update, or approve assessments or evidence — blocked at route level
- `compliance_specialist` cannot upload evidence attachments — only plain-text comments
- `auditor` is strictly read-only — no `manage_evidence`
- Assessment creator (`createdBy`) cannot approve evidence on their own assessment
- Assessment creator cannot sign off as `assessment_reviewer` on their own assessment
- `super_admin` cannot modify their own `systemRoles`
- `control_owner` is subject to row-level security — can only access assessments where their email is in `participants`

**Assessment closure flow** — Closing requires a mandatory two-step sign-off: `compliance_manager` calls `PATCH /:id/request-review` → `assessment_reviewer` calls `PATCH /:id/reviewer-signoff` → `compliance_manager` calls `PUT /:id` with `{ status: "closed" }`. The backend rejects closure if `reviewerApproval` is not `"approved"`.

**Session security** — `super_admin` JWT expires in 4 hours; all other roles in 8 hours. Account locks after 5 failed login attempts. Logout invalidates the server-side session immediately.

**Audit logging** — All authentication events, role changes, password resets, access denials, and user creation are written to structured audit logs with SHA-256 hash for tamper detection. Logs auto-expire after a configurable TTL (default: 60 days).

**Evidence versioning** — Every re-upload of attachments creates a new version; all prior versions are retained. Evidence older than 12 months is flagged as `isStale: true`.

---

## System Roles Summary

| Role | JWT Expiry | Key Capabilities |
|------|-----------|-----------------|
| `compliance_specialist` | 8h | Create assessments, assign controls, update maturity level, import evidence |
| `compliance_manager` | 8h | All specialist actions + upload evidence, approve evidence, request reviewer sign-off, close assessments (after reviewer approval), bulk-close controls |
| `control_owner` | 8h | Upload evidence and view comments for assigned controls only (row-level security enforced) |
| `auditor` | 8h | Read-only access to all modules including audit logs |
| `assessment_reviewer` | 8h | Read-only + mandatory second sign-off on evidence approval and assessment closure |
| `executive` | 8h | Dashboard and reports only |
| `super_admin` | 4h | User/role/department/framework/platform management only — zero assessment or evidence access |

---

## Migration & Changelog

If you're integrating against an older version of this API, see the [Frontend Migration Guide](docs/migration/FRONTEND_MIGRATION_GUIDE.md) for breaking field name changes in the Control model.
