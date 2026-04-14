# AI Integration API Documentation

## Overview

This document covers the AI integration layer for the CAP Assessment platform. It is intended for **three audiences**:

- **Backend** — implementation reference
- **Frontend** — how to integrate the approval flow and display AI results
- **AI Team** — how to fetch data and deliver results

---

## Who Uses What

| Audience | Route | Auth | Description |
|----------|-------|------|-------------|
| Frontend | `PATCH /api/assesment-comment/comments/:commentId/approval` | JWT | Auditor approves/rejects evidence |
| Frontend | `GET /api/assesment/:id` | JWT | Read assessment including `aiResult` |
| AI Team | `GET /api/ai/frameworks` | `x-api-key` | List all active frameworks |
| AI Team | `GET /api/ai/frameworks/:frameworkId/controls` | `x-api-key` | List controls for a framework |
| AI Team | `GET /api/ai/controls/:controlCode` | `x-api-key` | Get control details |
| AI Team | `POST /api/ai/webhook/result` | `x-webhook-secret` | Deliver AI result back |

> The `POST /api/assesment/:id/trigger-ai` endpoint still exists for manual triggering if needed, but AI is now **automatically triggered on each evidence approval**.

---

## How the Full Flow Works

```
[Participant]              [Auditor/Frontend]           [Backend]                [AI Machine]
      |                           |                         |                         |
      |-- adds comment            |                         |                         |
      |   with attachment ------->|-- POST create comment ->|                         |
      |                           |                         | approvalStatus=pending  |
      |                           |                         |                         |
      |                           |-- PATCH approval ------>|                         |
      |                           |   { status: approved }  |-- POST /analyze ------->|
      |                           |<-- 200 comment updated -|   (approved attachments)|
      |                           |                         |                         |
      |                           |                         |   (processing...)       |
      |                           |                         |<-- POST /webhook/result-|
      |                           |                         |   (saves to aiResult)   |
      |                           |-- GET /assesment/:id -->|                         |
      |                           |<-- assessment.aiResult -|                         |
```

**Key points:**
- AI is triggered **automatically on each approval** — no manual button needed
- Only **approved attachment URLs** are sent to the AI machine
- The trigger is fire-and-forget — the approval response returns immediately
- Frontend polls `GET /api/assesment/:id` to check when `aiResult` is updated

---

## Frontend Integration Guide

### 1. Evidence Comment Approval Status

Every top-level comment that has attachments will have an `approvalStatus` field:

| Value | Meaning |
|-------|---------|
| `pending` | Uploaded, waiting for auditor review |
| `approved` | Auditor approved — counts as valid evidence, AI triggered |
| `rejected` | Auditor rejected — auditor should reply with reason |
| `null` | Comment has no attachments (plain text or reply) — no approval needed |

### 2. Approval Button — Who Sees It

- Show the approve/reject buttons **only to the assessment creator (auditor)**
- Show them **only on top-level comments that have attachments** (`approvalStatus !== null`)
- Participants see the `approvalStatus` label but no action buttons

### 3. Approve or Reject Evidence

**Method:** `PATCH`
**URL:** `/api/assesment-comment/comments/:commentId/approval`
**Auth:** `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{ "status": "approved" }
```
or
```json
{ "status": "rejected" }
```
or to revoke a previous approval/rejection:
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
    "attachments": ["https://..."],
    ...
  }
}
```

**Error responses:**
```json
{ "error": "Comment not found" }                              // 404
{ "error": "Cannot approve a reply" }                        // 400
{ "error": "Only comments with attachments can be approved" } // 400
{ "error": "Only the assessment owner can approve evidence" } // 403
```

### 4. Rejection Flow

When the auditor rejects evidence, they should also reply to the comment explaining why. The participant then adds a **new top-level comment** with corrected evidence (not a reply). The new comment starts as `pending` again.

```
Comment A (rejected) ← auditor replies: "Please provide a signed copy"
Comment B (pending)  ← participant adds new comment with corrected file
```

### 5. After Approval — AI Result

When the auditor approves a comment, the backend automatically triggers the AI machine with all currently approved attachments for that assessment. The frontend does not need to do anything extra — just poll for the updated `aiResult`.

**Polling for AI result after approval:**
```typescript
const pollForAiResult = async (assessmentId: string, token: string) => {
  const MAX_ATTEMPTS = 20;   // ~2 minutes total
  const INTERVAL_MS = 6000;  // every 6 seconds

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    await new Promise(resolve => setTimeout(resolve, INTERVAL_MS));

    const res = await fetch(`/api/assesment/${assessmentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const assessment = await res.json();

    if (assessment.aiResult !== null) {
      return assessment.aiResult;
    }
  }

  throw new Error('AI result timed out. Please try again later.');
};
```

**Complete approval handler example:**
```typescript
const handleApprove = async (commentId: string) => {
  setApproving(true);
  try {
    await fetch(`/api/assesment-comment/comments/${commentId}/approval`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'approved' }),
    });

    // Refresh comments to show updated approvalStatus
    await refreshComments();

    // Poll for fresh AI result in background
    pollForAiResult(assessmentId, token)
      .then(result => setAiResult(result))
      .catch(() => {}); // silent fail — AI result will show when ready
  } finally {
    setApproving(false);
  }
};
```

### 6. UI States to Handle

**Per comment (auditor view):**

| `approvalStatus` | Show |
|-----------------|------|
| `pending` | "Approve" button (green) + "Reject" button (red) |
| `approved` | Green "Approved" badge + "Revoke" button |
| `rejected` | Red "Rejected" badge + "Revoke" button |
| `null` | Nothing (reply or plain text comment) |

**AI result panel:**

| State | What to show |
|-------|-------------|
| `aiResult === null`, no approved evidence yet | "No AI result yet. Approve evidence to trigger analysis." |
| `aiResult === null`, evidence was just approved | Spinner + "AI is analyzing approved evidence..." |
| `aiResult !== null` | Display the result |

### 7. Where `aiResult` Lives

`aiResult` is a field on the assessment document returned by `GET /api/assesment/:id`. It is `null` by default and gets updated each time the AI machine delivers a new result after an approval.

```json
{
  "_id": "507f1f77bcf86cd799439015",
  "name": "Q1 2024 Access Control Review",
  "status": "in_progress",
  "aiResult": null
}
```
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "aiResult": {
    "summary": "...",
    "riskLevel": "medium",
    "score": 72,
    "recommendations": ["..."]
  }
}
```

> The exact structure of `aiResult` is defined by the AI team.

---

## AI Team Guide

### Authentication

All AI team routes use a static API key:
```
x-api-key: <AI_API_KEY>
```

The webhook uses a separate secret:
```
x-webhook-secret: <AI_WEBHOOK_SECRET>
```

Both values will be shared by the backend team.

---

### 1. List Frameworks

**Method:** `GET` | **URL:** `/api/ai/frameworks`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "displayId": "1",
    "displayName": "ISO 27001",
    "type": "international_standards",
    "complianceMetric": {
      "type": "maturity_level",
      "label": "Maturity Level",
      "values": [
        { "value": "1", "label": "Initial" },
        { "value": "2", "label": "Managed" },
        { "value": "3", "label": "Defined" },
        { "value": "4", "label": "Quantitatively Managed" },
        { "value": "5", "label": "Optimizing" }
      ],
      "defaultValue": "1"
    }
  }
]
```

---

### 2. List Controls by Framework

**Method:** `GET` | **URL:** `/api/ai/frameworks/:frameworkId/controls`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "controlCode": "A.5.1",
    "controlName": "Policies for information security",
    "domainCode": "A.5",
    "domainName": "Information Security Policies",
    "subdomainCode": null,
    "subdomainName": null,
    "description": "...",
    "properties": {}
  }
]
```

---

### 3. Get Control Details

**Method:** `GET` | **URL:** `/api/ai/controls/:controlCode`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "frameworkId": "507f1f77bcf86cd799439011",
  "frameworkName": "ISO 27001",
  "controlCode": "A.5.1",
  "controlName": "Policies for information security",
  "domainCode": "A.5",
  "domainName": "Information Security Policies",
  "subdomainCode": null,
  "subdomainName": null,
  "description": "...",
  "properties": {},
  "status": "active"
}
```

---

### 4. Receiving a Trigger (Inbound from Backend)

When an auditor approves evidence, the backend calls your service at:
```
POST <AI_SERVICE_URL>/analyze
```

**Payload:**
```json
{
  "assessmentId": "507f1f77bcf86cd799439015",
  "assessment": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Q1 2024 Access Control Review",
    "frameworkName": "ISO 27001",
    "controlId": "A.5.1",
    "controlName": "Policies for information security",
    "status": "in_progress",
    "complianceMetricValue": "3"
  },
  "approvedAttachments": [
    "https://storage.example.com/evidence-file-1.pdf",
    "https://storage.example.com/evidence-file-2.pdf"
  ]
}
```

> `approvedAttachments` contains only the URLs of comments that have been approved by the auditor. These are the only documents you should analyze.

Process asynchronously and deliver the result via the webhook below.

---

### 5. Webhook — Deliver AI Result

**Method:** `POST`
**URL:** `/api/ai/webhook/result`
**Header:** `x-webhook-secret: <AI_WEBHOOK_SECRET>`

**Request Body:**
```json
{
  "assessmentId": "507f1f77bcf86cd799439015",
  "result": {
    "summary": "The access control policy shows partial compliance...",
    "riskLevel": "medium",
    "score": 72,
    "recommendations": [
      "Update policy documentation",
      "Conduct staff training"
    ]
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `assessmentId` | string | Yes | Same `assessmentId` from the trigger payload |
| `result` | object | Yes | Your analysis output — any JSON structure, stored as-is |

**Success Response:**
```json
{ "message": "AI result saved successfully" }
```

**Error Responses:**
```json
{ "error": "assessmentId and result are required" }  // 400
{ "error": "Assessment not found" }                  // 404
{ "error": "Invalid or missing webhook secret" }     // 401
```

---

## Environment Variables (Backend)

```env
AI_API_KEY=cap-ai-external-key-2024
AI_WEBHOOK_SECRET=cap-webhook-secret-2024
AI_SERVICE_URL=http://ai-service.internal/api
```
