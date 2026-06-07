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
| Assessments | Create, track and manage compliance assessments | [→ Assessment API](docs/assessments/ASSESSMENTS_API.md) · [→ Module Guide](docs/assessments/ASSESSMENT_MODULE_GUIDE.md) |
| Analytics | Dashboard analytics, framework summaries, metric distributions | [→ Analytics API](docs/analytics/ANALYTICS_API.md) |
| AI Integration | AI-powered evidence analysis and grading | [→ AI Integration](docs/ai/AI_INTEGRATION.md) |
| Roles & Permissions | System roles, permissions, and access control | [→ Roles & Permissions](docs/roles/ROLES_AND_PERMISSIONS.md) |

---

## Quick Reference — All Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

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
| POST | `/api/assesment/create` | Create an assessment |
| PUT | `/api/assesment/:id` | Update an assessment |
| GET | `/api/assesment/:id` | Get assessment details |
| GET | `/api/assesment/dashboard` | List assessments with filters & pagination |
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

### Users & Departments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/by-departments` | Get users by department IDs |
| PATCH | `/api/user/:id/system-roles` | Assign system roles to a user |

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

**Assessment grouping** — Multiple assessment records can share the same `assesmentId` (UUID) to represent a single assessment spanning multiple frameworks (common assessment).

**Compliance Metric** — Every framework defines a `complianceMetric` (either `maturity_level` or `percentage`) that drives how assessment scores are tracked and displayed.

**Evidence flow** — Participants upload evidence via comments → Auditor approves → AI analyzes → Result stored on the assessment.

**Roles** — Users have `systemRoles` (e.g. `compliance_specialist`, `auditor`, `super_admin`) that map to granular `view_*` / `manage_*` permissions.

---

## Migration & Changelog

If you're integrating against an older version of this API, see the [Frontend Migration Guide](docs/migration/FRONTEND_MIGRATION_GUIDE.md) for breaking field name changes in the Control model.
