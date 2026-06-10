# Assessment Module Guide

This document explains the full module architecture, the new assessment flow, and all user journeys end-to-end — intended for both backend and **frontend developers**.

→ Back to [README](../../README.md)

---

## What Changed & Why

Previously, creating an assessment required selecting controls, departments, and participants upfront. This was a blocker for the business team — at the time of creation they often don't know which controls belong to which team or who the responsible person is.

**The new flow separates assessment creation from control assignment into two distinct steps.**

---

## New Flow Overview (3 Steps)

```
STEP 1 — Create Assessment
  Business team fills name, framework, dates only
  No controls, no departments, no participants required
  → One assessment record created with status: "drafted"
  → Appears as one row in the dashboard

STEP 2 — Assign Controls  (clicking the assessment row)
  Responsible person opens the Control Assignment page
  Sees full list of controls for that framework
  Already-assigned controls are shown as checked/disabled
  Unassigned controls have checkboxes to select + dept + participants
  → On save: each newly selected control creates a new "open" record
  → Assessment derived status becomes "open" once controls are assigned

STEP 3 — Review Assessment  (clicking the View icon)
  User clicks the view/eye icon on the dashboard row
  Navigates to the Assessment Detail page for a specific control record
  Evidence upload, approval, AI analysis — all unchanged
```

---

## Frontend Page Guide

### Page 1 — Create Assessment Form

**What to show:**
- Form fields: Assessment Name, Description, Framework (dropdown), Start Date, Due Date
- After framework is selected → fetch and display the framework's controls list as **read-only** (visibility only, no selection)
- Generate a `assesmentId` UUID on the frontend before submitting

**Removed from this form:**
- Control selector
- Department selector
- Participant selector

**On submit:** `POST /api/assesment/create`

**Request body:**
```json
{
  "assesmentId": "<uuid-generated-by-frontend>",
  "name": "SAMA CSF 2024",
  "description": "Annual SAMA compliance assessment",
  "framework": "<frameworkObjectId>",
  "startDate": 1704067200,
  "dueDate": 1735689600
}
```

**Response:** Single assessment record with `status: "drafted"`

---

### Page 2 — Assessment Dashboard (List Page)

**API:** `GET /api/assesment/dashboard`

Returns results **grouped by `assesmentId`** — one row per assessment regardless of how many controls are assigned.

**Query params (all optional):**

| Param | Description |
|-------|-------------|
| `status` | `drafted` \| `open` \| `in_progress` \| `closed` — filters on **derived** status |
| `frameworkType` | Framework type filter |
| `search` | Searches name, description, frameworkName |
| `dateFrom` / `dateTo` | Creation date range (Unix timestamps) |
| `startDateFrom` / `startDateTo` | Start date range |
| `dueDateFrom` / `dueDateTo` | Due date range |
| `page` | Default: 1 |
| `limit` | Default: 10, max: 100 |

**Response:**
```json
{
  "data": [
    {
      "assessmentDocId": "<mongoObjectId>",
      "assesmentId": "uuid-abc-123",
      "name": "SAMA CSF 2024",
      "description": "Annual SAMA compliance assessment",
      "frameworkName": "SAMA CSF",
      "framework": "<frameworkObjectId>",
      "frameworkType": "SAMA",
      "derivedStatus": "open",
      "totalControls": 5,
      "startDate": 1704067200,
      "dueDate": 1735689600,
      "createdBy": "john.doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

**Key fields for frontend:**
- `assesmentId` (UUID) — use this to navigate to the Control Assignment Page and to fetch assigned controls
- `assessmentDocId` (MongoDB `_id`) — use this to navigate to Assessment Detail Page
- `totalControls` — number of controls assigned so far (0 means nothing assigned yet)
- `derivedStatus` — the computed overall status of the assessment (not a raw DB field)
- `derivedStatus: "drafted"` — nothing assigned yet, show a visual indicator

**What to show per row:**
- Columns: Assessment Name | Framework | Status | Total Controls | Assessor | Due Date | Actions
- Two action icons per row:
  - **Assign Controls** (clicking the row or a dedicated icon) → Control Assignment Page using `assesmentId`
  - **View** (eye icon) → Assessment Detail Page using `assessmentDocId`

---

### Page 3 — Control Assignment Page (NEW PAGE)

Opens when user clicks an assessment row in the dashboard.

**URL pattern:** `/assessments/:assesmentId/assign-controls`

**Step 1 — Fetch data (two parallel calls):**

```
GET /api/control/list/:frameworkId
→ All controls for the framework (full list)

GET /api/assesment/:assesmentId/assigned-controls
→ Controls already assigned to this assessment
```

**Assigned controls response:**
```json
[
  {
    "_id": "<assessmentRecordMongoId>",
    "control": "<controlObjectId>",
    "controlId": "3.1.1",
    "controlName": "Access Control Policy",
    "departments": [{ "id": "...", "name": "IT Department" }],
    "participants": ["user@example.com"],
    "status": "open"
  }
]
```

**Step 2 — Render the control list:**

Compare both lists using `control` ObjectId to determine state of each control:

| State | How to show |
|-------|-------------|
| Already assigned | Checked checkbox, dept/participants pre-filled, **editable** (can update dept/participants) |
| Not yet assigned | Unchecked checkbox, dept/participants empty, **editable** |
| Already assigned + status `closed` | Checked checkbox, dept/participants shown, **read-only** (cannot modify a closed control) |

**Each unassigned control row has:**
- Checkbox to select
- Department dropdown (required when checked) — populate from `GET /api/department/list`
- Participants multi-select (optional) — populate from `GET /api/user/by-departments?departmentIds=id1,id2` after department is selected

**Each already-assigned control row has:**
- Checkbox checked and disabled (cannot unassign)
- Department and participants **editable inline** (unless status is `closed`)
- An **Edit** icon or inline save to trigger `PATCH /api/assesment/assigned-controls/:assessmentRecordId`

**Step 3 — Save new assignments:**

`POST /api/assesment/:assesmentId/assign-controls`

Only send the **newly selected** controls (not already-assigned ones):

```json
{
  "controls": [
    {
      "controlId": "<controlMongoObjectId>",
      "departments": ["<deptObjectId>"],
      "participants": ["user@example.com"]
    }
  ]
}
```

**Step 4 — Update an already-assigned control:**

`PATCH /api/assesment/assigned-controls/:assessmentRecordId`

Use the `_id` from the assigned controls list as `:assessmentRecordId`. Send only the fields you want to change — both are optional:

```json
{
  "departments": ["<deptObjectId>", "<anotherDeptObjectId>"],
  "participants": ["user@example.com", "newperson@example.com"]
}
```

**Response:** Updated assigned control record.
```json
{
  "_id": "<assessmentRecordMongoId>",
  "control": "<controlObjectId>",
  "controlId": "3.1.1",
  "controlName": "Access Control Policy",
  "departments": [
    { "id": "...", "name": "IT Department" },
    { "id": "...", "name": "Risk & Compliance" }
  ],
  "participants": ["user@example.com", "newperson@example.com"],
  "status": "open",
  "complianceMetricValue": "1"
}
```

**Error Responses:**
```json
{ "error": "Assessment control record not found" }         // 400
{ "error": "Cannot update a draft record" }               // 400
{ "error": "Cannot update a closed assessment control" }  // 400
{ "error": "Invalid department id(s)" }                   // 400
```

> Email notifications are sent **only to newly added participants** — people already in the list do not receive a duplicate email.

**After save:**
- Each assigned control gets a new record with `status: "open"` and `complianceMetricValue` pre-set to the framework's default value
- Assessment `derivedStatus` on the dashboard becomes `"open"` automatically on next fetch (derived from control records)
- Participants receive an email notification automatically

---

### Page 4 — Assessment Detail Page (Unchanged)

Accessed via the **View icon** on the dashboard row, using `assessmentDocId`.

**URL pattern:** `/assessments/:id`

Everything on this page remains the same:
- Evidence upload (comments with attachments)
- Approval flow (auditor approves/rejects)
- AI analysis result display
- Import evidence from previous assessment
- Update compliance metric value
- Close assessment

---

### Page 5 — My Tasks (Sidebar Tab)

**Who sees this:** Every logged-in user who has been added as a participant on at least one control. Primarily used by `control_owner` but visible to all roles.

**Required permission:** `view_evidence` — guard the sidebar tab and the page with this permission check.

```ts
const canViewMyTasks = effectivePermissions.includes('view_evidence');
```

> `control_owner` has `view_evidence` and `manage_evidence` by default, so they will always see this tab. All other roles that have `view_evidence` (e.g. `compliance_specialist`, `auditor`) will also see it — which is intentional since they may also be added as participants.

**Placement suggestion:** Persistent sidebar tab labelled **"My Tasks"** — always accessible regardless of which page the user is on, similar to a notifications/inbox pattern. This keeps it clearly separate from the Assessment List (which is the auditor's view).

**API:** `GET /api/assesment/my-controls`

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `status` | `open` \| `in_progress` \| `closed` | excludes `closed` | Filter by status. Omit to see active tasks only. Pass `closed` to see completed work. |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page (max: 100) |

**How it works:** The backend matches the logged-in user's `email` (from the JWT) against the `participants` array on each assessment record. No extra parameter needed — it's always scoped to the caller.

**Example Requests:**
```
# Active tasks (default)
GET /api/assesment/my-controls

# Filter to in-progress only
GET /api/assesment/my-controls?status=in_progress

# See completed tasks
GET /api/assesment/my-controls?status=closed

# Paginate
GET /api/assesment/my-controls?page=2&limit=20
```

**Response:**
```json
{
  "data": [
    {
      "_id": "64abc...",
      "assesmentId": "uuid-abc-123",
      "name": "SAMA CSF Q1 2025",
      "frameworkName": "SAMA CSF",
      "controlId": "3.1.1-1",
      "controlName": "Establish a cyber security committee",
      "departments": [{ "id": "...", "name": "IT Security" }],
      "status": "open",
      "startDate": 1704067200,
      "dueDate": 1735689600,
      "aiResult": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "pages": 1
  }
}
```

**What to show per row:**

| Field | Display |
|---|---|
| `name` | Assessment name |
| `frameworkName` | Framework badge |
| `controlId` + `controlName` | Control being assessed |
| `departments[].name` | Assigned department(s) |
| `status` | Status badge (`open` / `in_progress`) |
| `dueDate` | Due date — highlight red if overdue |
| `aiResult` | Show AI result indicator if not null |
| Action | **"Upload Evidence"** button → navigates to `GET /api/assesment/:_id` detail page |

**Sidebar badge:** Show a count of active tasks (status `open` or `in_progress`) on the "My Tasks" sidebar tab as a notification badge. Fetch this on login and refresh after any evidence upload.

```ts
const fetchMyTasksCount = async () => {
  const res = await api.get('/assesment/my-controls?limit=1');
  return res.data.pagination.total; // total active tasks
};
```

**Navigation on row click:** Use the `_id` field to navigate to the Assessment Detail page where the user uploads evidence:
```ts
navigate(`/assessments/${task._id}`);
```

---

## Status Reference

| Status | What it means |
|--------|---------------|
| `drafted` | Assessment has no controls assigned yet (single entry in DB) |
| `open` | Controls assigned, none have evidence yet |
| `in_progress` | At least one control has evidence uploaded |
| `closed` | All controls are closed |

### Status Derivation Logic (Dashboard)

The dashboard derives the overall assessment status from its control records:

```
totalControls == 0            → drafted
closedCount == totalControls  → closed
inProgressCount > 0           → in_progress
default                       → open
```

This means:
- Filter `status=drafted` → assessments with no controls assigned
- Filter `status=open` → controls assigned but no evidence on any of them
- Filter `status=in_progress` → at least one control has evidence
- Filter `status=closed` → every single control is closed

---

## Data Model

### Assessment Record

One `assesmentId` UUID groups multiple DB records:
- 1 initial record (`status: drafted`) — created on assessment creation, no control assigned
- N control records (`status: open/in_progress/closed`, `control: ObjectId`) — created when controls are assigned

```typescript
{
  assesmentId: string;              // UUID — groups all records for one assessment
  name: string;
  description: string;
  frameworkType: string;
  framework: ObjectId;              // ref: Framework
  frameworkName: string;
  control: ObjectId | null;         // null = initial draft record
  controlId: string | null;
  controlName: string | null;
  departments: [{ id: ObjectId; name: string }];
  participants: string[];
  attachments: string[];
  status: 'drafted' | 'open' | 'in_progress' | 'closed';  // per-record DB status
  complianceMetricValue: string | null;
  commonAssessmentId: ObjectId | null;
  aiResult: object | null;
  startDate: number;                // Unix timestamp (seconds)
  dueDate: number;                  // Unix timestamp (seconds)
  createdBy: string;
}
```

---

## API Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assesment/create` | Create a drafted assessment |
| GET | `/api/assesment/dashboard` | List assessments grouped by `assesmentId` |
| GET | `/api/assesment/my-controls` | Controls assigned to the logged-in user (My Tasks sidebar) |
| GET | `/api/assesment/:assesmentId/assigned-controls` | Get already-assigned controls for an assessment |
| POST | `/api/assesment/:assesmentId/assign-controls` | Assign controls to an assessment |
| PATCH | `/api/assesment/assigned-controls/:assessmentRecordId` | Update departments or participants on an assigned control |
| GET | `/api/assesment/:id` | Get a specific assessment record by MongoDB `_id` |
| PUT | `/api/assesment/:id` | Update an assessment record |
| PATCH | `/api/assesment/:id/import-evidence` | Import evidence from another assessment |
| POST | `/api/assesment-comment/:assessmentId/comments/create` | Add evidence comment |
| GET | `/api/assesment-comment/:assessmentId/comments` | Get comments for an assessment |
| PATCH | `/api/assesment-comment/comments/:commentId/approval` | Approve or reject evidence |

---

## Evidence & Approval Flow

### How it works

```
Participant posts comment with attachment
        ↓
backend saves comment, approvalStatus = "pending"
AI triggered immediately (fire-and-forget)
        ↓
compliance_specialist reviews evidence
        ↓
    approved?
   ↙         ↘
  YES          NO
  ↓             ↓
Green badge   Red badge + specialist replies with reason
              Participant adds new top-level comment
              (new comment starts as "pending", AI re-triggers)
```

### approvalStatus values

| Value | Meaning |
|-------|---------|
| `pending` | Uploaded, waiting for review |
| `approved` | Compliance specialist approved |
| `rejected` | Compliance specialist rejected |
| `null` | Plain text comment or reply — no approval needed |

### Approval Button — Who Sees It

Only `compliance_specialist` can approve or reject evidence.

```ts
const canApprove = user.systemRoles.includes('compliance_specialist');
// show approve/reject buttons only when canApprove && comment.approvalStatus !== null
```

### Approve or Reject Evidence

**Method:** `PATCH`  
**URL:** `/api/assesment-comment/comments/:commentId/approval`  
**Auth:** `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{ "status": "approved" }
```
```json
{ "status": "rejected" }
```
```json
{ "status": "pending" }
```

**Response:**
```json
{
  "message": "Evidence approved",
  "comment": {
    "_id": "507f1f77bcf86cd799439020",
    "approvalStatus": "approved",
    "attachments": ["https://..."]
  }
}
```

**Error Responses:**
```json
{ "error": "Comment not found" }                                          // 404
{ "error": "Cannot approve a reply" }                                     // 400
{ "error": "Only comments with attachments can be approved" }             // 400
{ "error": "Only compliance specialists can approve evidence" }           // 403
```

### UI States per Comment

| `approvalStatus` | compliance_specialist sees | other roles see |
|-----------------|---------------------------|------------------|
| `pending` | Approve + Reject buttons | `pending` badge |
| `approved` | Green badge + Revoke button | Green badge |
| `rejected` | Red badge + Revoke button | Red badge |
| `null` | Nothing | Nothing |

### AI Result Panel States

| State | What to show |
|-------|--------------|
| `aiResult === null`, no evidence posted | "No AI result yet. Submit evidence to trigger analysis." |
| `aiResult === null`, evidence just posted | Spinner + "AI is analyzing submitted evidence..." |
| `aiResult !== null` | Display grade, gaps, recommendations |

### Polling for AI Result

After posting a comment with attachments, poll `GET /api/assesment/:id` until `aiResult` is populated:

```ts
const pollForAiResult = async (assessmentId: string, token: string) => {
  const MAX_ATTEMPTS = 20;  // ~2 minutes
  const INTERVAL_MS = 6000;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    await new Promise(resolve => setTimeout(resolve, INTERVAL_MS));
    const res = await fetch(`/api/assesment/${assessmentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const assessment = await res.json();
    if (assessment.aiResult !== null) return assessment.aiResult;
  }

  throw new Error('AI result timed out.');
};
```

### AI Result Fields to Display

| Field | Type | Description |
|-------|------|-------------|
| `aiResult.grade` | string | Overall compliance grade (e.g. `A`, `B`, `C`) |
| `aiResult.gaps` | string[] | Identified compliance gaps |
| `aiResult.recommendations` | string[] | Recommended actions |

Arabic equivalents: `aiResult.arabic_output.grade`, `.gaps`, `.recommendations`.

### Comment importedFrom Tracking

| `importedFrom` field | Meaning |
|----------------------|---------|
| `null` | Manually added — preserved on re-import |
| `ObjectId` | Imported from that assessment — replaced on re-import |
