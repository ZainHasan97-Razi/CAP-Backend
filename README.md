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
| GET | `/api/assesment/:id` | Get assessment details |
| PUT | `/api/assesment/:id` | Update an assessment |
| PATCH | `/api/assesment/:id/import-evidence` | Import evidence from another assessment |

### Assessment Comments (Evidence)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assesment-comment/:assessmentId/comments/create` | Add a comment/evidence |
| GET | `/api/assesment-comment/:assessmentId/comments` | Get comments for an assessment |
| PATCH | `/api/assesment-comment/comments/:commentId/approval` | Approve or reject evidence |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assesment/analytics` | Overall analytics with per-framework distribution |
| GET | `/api/assesment/framework-summaries` | Framework cards with average score and hover distribution |
| GET | `/api/assessments/by-metric` | Paginated assessment list for a specific metric value |

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

**Evidence flow** — Participants upload evidence via comments → Auditor approves → AI analyzes → Result stored on the assessment.

**Roles** — Users have `systemRoles` (e.g. `compliance_specialist`, `auditor`, `super_admin`) that map to granular `view_*` / `manage_*` permissions.

---

## Migration & Changelog

If you're integrating against an older version of this API, see the [Frontend Migration Guide](docs/migration/FRONTEND_MIGRATION_GUIDE.md) for breaking field name changes in the Control model.
