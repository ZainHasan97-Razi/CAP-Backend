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

### Page 3b — Bulk Close Controls (compliance_manager only)

This feature lives inside the Control Assignment Page. It allows a `compliance_manager` to close multiple assigned controls at once instead of going into each detail page individually.

#### Role guard

Only render the "Select Many" button when:

```ts
const canBulkClose = user.systemRoles.includes('compliance_manager');
```

Do not show the button for any other role.

---

#### UI Flow

**Default state** — a "Select Many" button sits in the top-right of the assigned controls section:

```
[ Assign Controls page header ]
                              [ Select Many ]   ← compliance_manager only
──────────────────────────────────────────────
  Domain filter: [ All | Domain A | Domain B ]
──────────────────────────────────────────────
  Control 1 — open
  Control 2 — in_progress
  Control 3 — closed          ← greyed out
```

**Selection mode** — after clicking "Select Many":

1. "Select Many" becomes **"Cancel"**
2. **"Close Selected (0)"** button appears — disabled until ≥ 1 item is checked
3. A **"Select All"** checkbox appears in the list header
4. Each `open` or `in_progress` row gets a **checkbox** on its left
5. `closed` rows get **no checkbox** and stay greyed out — not selectable

```
[ Cancel ]  [ Close Selected (0) ]   ← disabled
──────────────────────────────────────────────
  Domain filter: [ All | Domain A | Domain B ]
──────────────────────────────────────────────
  [✓] Select All
──────────────────────────────────────────────
  [ ] Control 1 — open
  [ ] Control 2 — in_progress
      Control 3 — closed              ← no checkbox
```

**Domain filter behaviour in selection mode:**
- The domain filter is client-side — it filters the already-fetched list locally
- "Select All" selects only controls **currently visible** (matching the active domain filter)
- Switching domain while items are selected **clears all selections**

**Confirmation dialog** — clicking "Close Selected (N)" shows:

```
┌─────────────────────────────────────────┐
│  Close 3 controls?                      │
│                                         │
│  This will permanently set the          │
│  selected controls to "closed".         │
│  This action cannot be undone.          │
│                                         │
│  [ Cancel ]      [ Close Controls ]     │
└─────────────────────────────────────────┘
```

**After success:**
1. Close dialog, exit selection mode
2. Re-fetch `GET /api/assesment/:assesmentId/assigned-controls` to sync row statuses
3. Show toast:
   - `skipped === 0` → `"3 controls closed successfully"`
   - `skipped > 0` → `"3 controls closed, 1 already closed and skipped"`

**On error:** keep dialog open, show the error message, let the user retry or cancel.

---

#### API Call

**Method:** `PATCH`  
**URL:** `/api/assesment/:assesmentId/bulk-close`  
**Auth:** `Authorization: Bearer <jwt_token>`  
**Role:** `compliance_manager` only — all other roles receive `403`

Use the `_id` field from the assigned-controls response as the record IDs:

```json
{
  "recordIds": [
    "<assessmentRecordMongoId_1>",
    "<assessmentRecordMongoId_2>",
    "<assessmentRecordMongoId_3>"
  ]
}
```

**Response `200`:**

```json
{
  "message": "Bulk close completed",
  "closed": 3,
  "skipped": 1,
  "results": [
    { "recordId": "<id_1>", "status": "closed" },
    { "recordId": "<id_2>", "status": "closed" },
    { "recordId": "<id_3>", "status": "closed" },
    { "recordId": "<id_4>", "status": "skipped", "reason": "already closed" }
  ]
}
```

**Error Responses:**

```json
{ "statusCode": 403, "message": "Only compliance managers can bulk close controls" }
{ "statusCode": 400, "message": "recordIds must be a non-empty array" }
{ "statusCode": 400, "message": "Record <id> does not belong to this assessment" }
```

> Backend validates that **all** recordIds belong to the `:assesmentId` before touching anything — if any ID is foreign the entire request is rejected.

---

#### Key field mapping

| Assigned-controls field | Used for |
|---|---|
| `_id` | Sent in `recordIds` to the bulk-close endpoint |
| `status` | Determines if checkbox is shown (`open`/`in_progress` → show, `closed` → hide) |
| `controlId` + `controlName` | Row display |

---

### Page 4 — Assessment Detail Page

Accessed via the **View icon** on the dashboard row, using `assessmentDocId`.

**URL pattern:** `/assessments/:id`

**Fetch the record on mount:**
```
GET /api/assesment/:id
```
Use the MongoDB `_id` of the **individual control record** (the `assessmentDocId` from the dashboard, or the `_id` from the assigned-controls list). This is a control-level record, not the draft header.

**What this page handles:**
- Evidence upload (comments with attachments)
- Approval flow (auditor approves/rejects)
- AI analysis result display
- Import evidence from previous assessment
- Update compliance metric value (`complianceMetricValue`)
- Close assessment (`status: "closed"`)

---

#### Updating Maturity Level / Compliance Metric Value

**Who can do this:** `compliance_specialist` and `compliance_manager`

```ts
const canUpdateMetric = user.systemRoles.some(r =>
  ['compliance_specialist', 'compliance_manager'].includes(r)
);
```

Show the maturity level dropdown only when `canUpdateMetric` is true. For all other roles render it as read-only text.

**API call:**

```
PUT /api/assesment/:id
Authorization: Bearer <token>
Content-Type: application/json

{ "complianceMetricValue": "3" }
```

> **Critical — use the right `:id`:** this must be the MongoDB `_id` of the **control record** (the one with `control: ObjectId`, not the draft header with `control: null`). Use `assessmentDocId` from the dashboard response, or the `_id` from `GET /api/assesment/:assesmentId/assigned-controls`.

**Available values** come from the framework's `complianceMetric.values` array — fetch them via `GET /api/framework/:id` and use `complianceMetric.values` to build the dropdown options:

```ts
// Example values for a maturity_level framework
[
  { value: "0", label: "Not Implemented" },
  { value: "1", label: "Initial" },
  { value: "2", label: "Developing" },
  { value: "3", label: "Defined" },
  { value: "4", label: "Managed" },
  { value: "5", label: "Optimized" }
]
```

```ts
const handleMetricUpdate = async (assessmentId: string, value: string) => {
  await api.put(`/assesment/${assessmentId}`, { complianceMetricValue: value });
};
```

**Allowed fields for `PUT /api/assesment/:id`:**

| Field | Description |
|---|---|
| `complianceMetricValue` | Maturity level or percentage value — must match a valid value from the framework |
| `status` | `open` \| `in_progress` \| `closed` \| `drafted` |
| `attachments` | Array of attachment URLs |
| `description` | Assessment description |
| `auditorNotes` | Auditor's notes (string or null) |

**Error Responses:**
```json
{ "error": "Assessment not found" }                          // 404
{ "error": "Invalid complianceMetricValue for this framework" } // 400
```

---

#### Closing an Assessment

**Who can do this:** `compliance_manager` only — but only after an `assessment_reviewer` has signed off.

Closing an assessment is a **two-step process**:

```
Step 1 — compliance_manager requests review:
  PATCH /api/assesment/:id/request-review
  → sets reviewerApproval: "pending"

Step 2 — assessment_reviewer approves:
  PATCH /api/assesment/:id/reviewer-signoff
  → sets reviewerApproval: "approved"

Step 3 — compliance_manager closes:
  PUT /api/assesment/:id  { "status": "closed" }
  → backend enforces reviewerApproval === "approved" before accepting
```

**`reviewerApproval` field values:**

| Value | Meaning |
|-------|---------|
| `null` | No review requested yet |
| `"pending"` | Review requested, awaiting `assessment_reviewer` sign-off |
| `"approved"` | Reviewer signed off — assessment can now be closed |

**Request Review**

`PATCH /api/assesment/:id/request-review` — `compliance_manager` only

```json
// No body required
```

**Error Responses:**
```json
{ "error": "Cannot request review on a draft assessment" }         // 400
{ "error": "Assessment is already closed" }                        // 400
{ "error": "Review already requested" }                            // 400
{ "error": "Assessment already approved by reviewer" }             // 400
```

**Reviewer Sign-off**

`PATCH /api/assesment/:id/reviewer-signoff` — `assessment_reviewer` only

```json
// No body required
```

**Error Responses:**
```json
{ "error": "No pending review request for this assessment" }       // 400
{ "error": "Assessment creator cannot sign off as reviewer" }      // 403
```

**Frontend button visibility:**

```ts
// Show "Request Review" button when:
const canRequestReview =
  user.systemRoles.includes('compliance_manager') &&
  assessment.reviewerApproval === null &&
  assessment.status !== 'closed';

// Show "Approve for Closure" button when:
const canSignOff =
  user.systemRoles.includes('assessment_reviewer') &&
  assessment.reviewerApproval === 'pending';

// Show "Close Assessment" button when:
const canClose =
  user.systemRoles.includes('compliance_manager') &&
  assessment.reviewerApproval === 'approved';
```

> Closed assessments are **immutable** — once `status: closed` is set, no further updates of any kind are accepted. The backend returns `403` on any `PUT /api/assesment/:id` call against a closed record.

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
| PATCH | `/api/assesment/:assesmentId/bulk-close` | Bulk close selected control records — `compliance_manager` only |
| PATCH | `/api/assesment/:id/request-review` | Request reviewer sign-off — `compliance_manager` only |
| PATCH | `/api/assesment/:id/reviewer-signoff` | Approve assessment for closure — `assessment_reviewer` only |
| GET | `/api/assesment/:id` | Get a specific assessment record by MongoDB `_id` |
| PUT | `/api/assesment/:id` | Update an assessment record |
| PATCH | `/api/assesment/:id/import-evidence` | Import evidence from another assessment |
| POST | `/api/assesment-comment/:assessmentId/comments/create` | Add evidence comment — `compliance_manager` and `control_owner` only for attachments |
| GET | `/api/assesment-comment/:assessmentId/comments` | Get comments for an assessment (includes `isStale` flag) |
| PATCH | `/api/assesment-comment/comments/:commentId/approval` | Approve or reject evidence — `compliance_manager` or `assessment_reviewer` only |
| GET | `/api/assesment-comment/comments/:commentId/versions` | Get full version history for a comment |

---

## Evidence & Approval Flow

### Add Evidence Comment

**POST** `/api/assesment-comment/:assessmentId/comments/create`

> **Who can upload evidence (attachments):** `compliance_manager` and `control_owner` only. All other roles (including `compliance_specialist`) can post plain-text comments but will receive `403` if `attachments` is non-empty.

```json
{
  "content": "This document outlines our access control policy",
  "attachments": ["https://storage.example.com/policy.pdf"],
  "evidenceType": "implementation",
  "evidenceValidatedAt": 1704067200
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `content` | Yes | Comment text (max 2000 chars) |
| `attachments` | No | Array of file URLs |
| `evidenceType` | No | `implementation` \| `design` \| `architectural` |
| `evidenceValidatedAt` | No | Unix timestamp (seconds) — the date the document/evidence was validated or issued. Top-level comments only. Preserved when evidence is reused across assessments. |

**`evidenceValidatedAt` rules:**
- Only applies to top-level comments (not replies)
- Set by the person uploading the evidence
- Carries over automatically when evidence is imported/reused in another assessment (common control or evidence import flow)
- Use this to show how old the evidence is — e.g. "Validated 14 months ago"
- Send `null` to clear it on update

**Side effects:**
- If assessment status is `open` and comment has attachments or evidenceType → status auto-updates to `in_progress`
- Top-level comments with attachments get `approvalStatus: "pending"` automatically
- Replies and plain-text comments get `approvalStatus: null`
- AI analysis is triggered automatically when a top-level comment with attachments is posted
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

Only `compliance_manager` or `assessment_reviewer` can approve or reject evidence. The creator of the assessment (`createdBy`) is blocked from approving even if they hold one of these roles — enforced at the workflow level.

```ts
const canApprove = user.systemRoles.some(r =>
  ['compliance_manager', 'assessment_reviewer'].includes(r)
);
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
{ "error": "Comment not found" }                                                              // 404
{ "error": "Cannot approve a reply" }                                                         // 400
{ "error": "Only comments with attachments can be approved" }                                 // 400
{ "error": "Only compliance managers and assessment reviewers can approve evidence" }          // 403
{ "error": "Assessment creator cannot approve evidence on their own assessment" }              // 403
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

---

## Comment Shape Reference

Fields returned on every comment from `GET /api/assesment-comment/:assessmentId/comments`:

```typescript
{
  _id: string;
  assessmentId: string;
  parentCommentId: string | null;     // null = top-level
  content: string;
  author: string;
  authorName: string;
  attachments: string[];              // file URLs
  evidenceType: "implementation" | "design" | "architectural" | null;
  evidenceValidatedAt: number | null; // Unix timestamp — when the evidence was validated/issued
  approvalStatus: "pending" | "approved" | "rejected" | null;
  importedFrom: string | null;        // ObjectId of source assessment if imported
  version: number;                    // starts at 1, increments each time attachments are changed
  previousVersionId: string | null;   // ObjectId of the archived previous version document
  isStale: boolean;                   // true if evidenceValidatedAt is older than 12 months
  isEdited: boolean;
  editedAt: string | null;
  createdAt: string;
  updatedAt: string;
  replies: Comment[];                 // nested, top-level only
}
```

`evidenceValidatedAt` is only meaningful on top-level comments with attachments. Replies always have it as `null`.

`isStale` is a computed field — not stored in DB. When `true`, show a warning badge on the evidence item (e.g. "Evidence may be outdated — validated over 12 months ago").

`version` starts at 1. Each time attachments are changed via `PUT /comments/:commentId/update`, the old state is archived as a new document and `version` is incremented on the live record.

### Evidence Version History

**GET** `/api/assesment-comment/comments/:commentId/versions`

Returns the full version chain for a comment, from newest to oldest.

```json
{
  "message": "Request success",
  "versions": [
    { "_id": "...", "version": 3, "attachments": [...], "createdAt": "..." },
    { "_id": "...", "version": 2, "attachments": [...], "createdAt": "..." },
    { "_id": "...", "version": 1, "attachments": [...], "createdAt": "..." }
  ]
}
```
