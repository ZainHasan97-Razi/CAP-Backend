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
| Already assigned | Checked checkbox, dept/participants pre-filled, **disabled** (cannot re-assign) |
| Not yet assigned | Unchecked checkbox, dept/participants empty, **editable** |

**Each unassigned control row has:**
- Checkbox to select
- Department dropdown (required when checked) — populate from `GET /api/department/list`
- Participants multi-select (optional) — populate from `GET /api/user/by-departments?departmentIds=id1,id2` after department is selected

**Step 3 — Save:**

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
| GET | `/api/assesment/:assesmentId/assigned-controls` | Get already-assigned controls for an assessment |
| POST | `/api/assesment/:assesmentId/assign-controls` | Assign controls to an assessment |
| GET | `/api/assesment/:id` | Get a specific assessment record by MongoDB `_id` |
| PUT | `/api/assesment/:id` | Update an assessment record |
| PATCH | `/api/assesment/:id/import-evidence` | Import evidence from another assessment |
| POST | `/api/assesment-comment/:assessmentId/comments/create` | Add evidence comment |
| GET | `/api/assesment-comment/:assessmentId/comments` | Get comments for an assessment |
| PATCH | `/api/assesment-comment/comments/:commentId/approval` | Approve or reject evidence |

---

## Evidence & Approval Flow (Unchanged)

```
Participant adds comment with attachment
        ↓
approvalStatus = "pending"
AI analysis triggered automatically
        ↓
Auditor reviews evidence
        ↓
    approved?
   ↙         ↘
  YES          NO
  ↓             ↓
Green badge   Red badge
AI re-runs    Auditor replies with reason
              Participant adds new top-level comment
              (new comment starts as "pending")
```

### Comment Tracking

| `importedFrom` field | Meaning |
|----------------------|---------|
| `null` | Manually added — preserved on re-import |
| `ObjectId` | Imported from that assessment — replaced on re-import |
