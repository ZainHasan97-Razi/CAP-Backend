# Assessments API

Assessments track the compliance status of a control within a framework. This document covers all assessment endpoints — creation, updates, listing, and evidence import.

→ Back to [README](../../README.md)  
→ For full flows and architecture see [Assessment Module Guide](ASSESSMENT_MODULE_GUIDE.md)

---

## Key Concepts

- **`assesmentId`** (UUID) — groups related assessments together. A common assessment that spans multiple frameworks will have multiple records all sharing the same UUID.
- **`complianceMetricValue`** — automatically set from the framework's `defaultValue` on creation. Auditors update it to reflect the actual compliance level found.
- **Evidence import** — assessments can import comments/evidence from a previous assessment on the same control to avoid starting from scratch.

---

## Assessment Statuses

| Status | Description |
|--------|-------------|
| `open` | Created, no evidence added yet |
| `in_progress` | Has evidence or imported evidence |
| `closed` | Assessment completed |
| `discard` | Cancelled |

---

## Endpoints

### Create Assessment
**POST** `/api/assesment/create`

```json
{
  "assesmentId": "uuid-123-456-789",
  "name": "Q1 2024 SAMA Assessment",
  "description": "Quarterly compliance assessment",
  "framework": "507f1f77bcf86cd799439011",
  "control": "507f1f77bcf86cd799439012",
  "departments": ["507f1f77bcf86cd799439014"],
  "participants": ["user@example.com"],
  "attachments": [],
  "startDate": 1704067200,
  "dueDate": 1735689600
}
```

**Required fields:** `assesmentId`, `name`, `description`, `framework`, `control`, `departments`, `startDate`, `dueDate`

**Notes:**
- Do NOT send `complianceMetricValue` — backend auto-sets it from the framework's `defaultValue`
- `participants` receive an email notification (async, does not block response)
- Initial status is always `"open"`

**Response:**
```json
{
  "message": "Request success",
  "assesment": {
    "_id": "507f1f77bcf86cd799439015",
    "assesmentId": "uuid-123-456-789",
    "status": "open",
    "complianceMetricValue": "1",
    "frameworkName": "SAMA CSF",
    "controlId": "3.1.1-1",
    "controlName": "...",
    ...
  }
}
```

---

### Get Assessment
**GET** `/api/assesment/:id`

Returns the full assessment document including `complianceMetricValue` and `aiResult`.

---

### Update Assessment
**PUT** `/api/assesment/:id`

Only these fields can be updated:

```json
{
  "description": "Updated description",
  "status": "in_progress",
  "attachments": ["https://storage.example.com/file.pdf"],
  "complianceMetricValue": "3",
  "auditorNotes": "Controls verified against policy documentation."
}
```

`complianceMetricValue` must be a value that exists in the framework's `complianceMetric.values` array. `auditorNotes` is a free-text string, send `null` to clear it. Returns `"Invalid complianceMetricValue for this framework"` if not.

---

### List Assessments (Dashboard)
**GET** `/api/assesment/dashboard`

All query params are optional. Results are sorted newest first.

#### Filter Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `open` \| `in_progress` \| `closed` \| `discard` |
| `frameworkType` | string | e.g. `ISO`, `SOC2`, `NIST` |
| `department` | string | Department MongoDB ObjectId |
| `search` | string | Case-insensitive search on name, description, frameworkName, controlId, controlName |
| `dateFrom` | number | Filter by creation date from (Unix timestamp) |
| `dateTo` | number | Filter by creation date to (Unix timestamp) |
| `startDateFrom` | number | Filter by startDate from |
| `startDateTo` | number | Filter by startDate to |
| `dueDateFrom` | number | Filter by dueDate from |
| `dueDateTo` | number | Filter by dueDate to |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

**Response:**
```json
{
  "data": [
    {
      "_id": "...",
      "assesmentId": "uuid-123",
      "name": "Q1 2024 Security Assessment",
      "frameworkName": "ISO 27001",
      "controlId": "A.5.1",
      "controlName": "Access Control Policy",
      "status": "in_progress",
      "complianceMetricValue": "3",
      "startDate": 1704067200,
      "dueDate": 1735689600,
      "departments": [{ "id": "...", "name": "IT Department" }],
      "participants": ["user@example.com"],
      "createdBy": "admin",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

### Import Evidence
**PATCH** `/api/assesment/:id/import-evidence`

Copies comments/evidence from a previous assessment into this one. Useful when the same control has been assessed before and you want to reuse existing evidence.

```json
{
  "sourceAssessmentId": "507f1f77bcf86cd799439099"
}
```

**Import is allowed if ANY of these conditions are true:**
1. Both assessments assess the same control (same MongoDB ObjectId)
2. Both share the same `assesmentId` UUID (same common assessment group)
3. Both controls belong to the same common control group

**Business rules:**
- Only the assessment owner (`createdBy`) can import
- Target must be `open` or `in_progress` — cannot import into `closed` or `discard`
- Re-import replaces previously imported comments, keeps manually added ones
- Status changes from `open` → `in_progress` after import

**Response:**
```json
{
  "message": "Evidence imported successfully",
  "assessment": { ... },
  "importedItems": {
    "comments": 5,
    "attachments": 3,
    "replacedComments": 2
  }
}
```

---

## Evidence (Comments)

### Add Comment
**POST** `/api/assesment-comment/:assessmentId/comments/create`

```json
{
  "content": "This document outlines our access control policy",
  "attachments": ["https://storage.example.com/policy.pdf"],
  "evidenceType": "implementation"
}
```

`evidenceType` options: `implementation` | `design` | `architectural`

**Side effects:**
- If assessment status is `open` and comment has attachments or evidenceType → status auto-updates to `in_progress`
- Top-level comments with attachments get `approvalStatus: "pending"` automatically
- Replies and plain-text comments get `approvalStatus: null`
- AI analysis is triggered automatically when a top-level comment with attachments is posted

---

### Get Comments
**GET** `/api/assesment-comment/:assessmentId/comments`

```json
[
  {
    "_id": "...",
    "content": "Top-level comment",
    "author": "user-id",
    "authorName": "John Doe",
    "attachments": ["https://..."],
    "evidenceType": "implementation",
    "approvalStatus": "pending",
    "importedFrom": null,
    "createdAt": "...",
    "replies": [
      {
        "_id": "...",
        "content": "Reply content",
        "authorName": "Jane Smith",
        "approvalStatus": null,
        "createdAt": "..."
      }
    ]
  }
]
```

`importedFrom: null` = manually added. `importedFrom: ObjectId` = imported from that assessment.

---

### Approve / Reject Evidence
**PATCH** `/api/assesment-comment/comments/:commentId/approval`

Only the assessment creator (auditor) can call this.

```json
{ "status": "approved" }
```

Valid values: `approved` | `rejected` | `pending` (to revoke)

When approved, AI analysis is automatically triggered with all approved attachment URLs.

**Rejection flow:** Auditor rejects and replies with the reason. Participant adds a new top-level comment with corrected evidence — the new comment starts as `pending`.

---

## Participants

To get users available for a given set of departments (for the participant selector):

**GET** `/api/user/by-departments?departmentIds=id1,id2`

```json
[
  {
    "_id": "...",
    "userName": "John Doe",
    "email": "john@example.com",
    "department": "IT Department",
    "departmentId": "..."
  }
]
```

**Typical flow:** User selects departments → fetch users by department IDs → show multi-select of users → send selected emails as `participants` in assessment create.

---

## Error Responses

| Error | Status | Cause |
|-------|--------|-------|
| `Invalid framework id` | 400 | Framework ObjectId not found |
| `Invalid control id` | 400 | Control ObjectId not found |
| `Invalid department id(s)` | 400 | One or more department IDs not found |
| `Invalid complianceMetricValue for this framework` | 400 | Value not in framework's values array |
| `Only the assessment owner can approve evidence` | 403 | Non-owner trying to approve |
| `Cannot approve a reply` | 400 | Trying to approve a reply comment |
| `Unauthorized` | 401 | Missing or invalid JWT |

---

## TypeScript Interfaces

```typescript
interface CreateAssessmentRequest {
  assesmentId: string;
  name: string;
  description: string;
  framework: string;
  control: string;
  departments: string[];
  participants?: string[];
  attachments?: string[];
  startDate: number;
  dueDate: number;
}

interface Assessment {
  _id: string;
  assesmentId: string;
  name: string;
  description: string;
  frameworkType: string;
  framework: string;
  frameworkName: string;
  control: string;
  controlId: string;
  controlName: string;
  departments: Array<{ id: string; name: string }>;
  participants: string[];
  attachments: string[];
  status: 'open' | 'in_progress' | 'closed' | 'discard';
  complianceMetricValue: string | null;
  commonAssessmentId: string | null;
  aiResult: object | null;
  startDate: number;
  dueDate: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardFilters {
  status?: string;
  frameworkType?: string;
  department?: string;
  search?: string;
  dateFrom?: number;
  dateTo?: number;
  startDateFrom?: number;
  startDateTo?: number;
  dueDateFrom?: number;
  dueDateTo?: number;
  page?: number;
  limit?: number;
}
```
